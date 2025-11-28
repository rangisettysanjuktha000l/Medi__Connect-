const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// Register
router.post('/register', async (req, res) => {
    try {
        const {
            name,
            firstName,
            lastName,
            email,
            password,
            role,
            phone,
            dateOfBirth,
            gender,
            emergencyContact,
            insuranceProvider,
            allergies,
            currentMedications,
            medicalHistory,
            specialization,
            qualifications,
            experience,
            consultationFee
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create new user
        const userData = {
            email,
            password,
            role: role || 'patient',
            phone
        };

        // Add name fields (support both formats for backward compatibility)
        if (firstName && lastName) {
            userData.firstName = firstName;
            userData.lastName = lastName;
            userData.name = `${firstName} ${lastName}`;
        } else if (name) {
            userData.name = name;
        }

        // Add patient-specific fields
        if (dateOfBirth) userData.dateOfBirth = dateOfBirth;
        if (gender) userData.gender = gender;
        if (emergencyContact) userData.emergencyContact = emergencyContact;
        if (insuranceProvider) userData.insuranceProvider = insuranceProvider;
        if (allergies) userData.allergies = allergies;
        if (currentMedications) userData.currentMedications = currentMedications;
        if (medicalHistory) userData.medicalHistory = medicalHistory;

        // Add doctor-specific fields if role is doctor
        if (role === 'doctor') {
            userData.specialization = specialization;
            userData.qualifications = qualifications;
            userData.experience = experience;
            userData.consultationFee = consultationFee;
        }

        const user = new User(userData);
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email' });
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        
        // Store OTP with 5-minute expiration
        const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
        otpStore.set(email, { otp, expiry: otpExpiry, used: false });

        // Configure email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'your-email@gmail.com',
                pass: process.env.EMAIL_PASS || 'your-app-password'
            }
        });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@mediconnect.com',
            to: email,
            subject: 'Password Reset OTP - MediConnect',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0066FF;">Password Reset Request</h2>
                    <p>Hello ${user.name || 'User'},</p>
                    <p>You requested to reset your password. Please use the following OTP to verify your identity:</p>
                    <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #0066FF; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
                    </div>
                    <p><strong>This OTP will expire in 5 minutes.</strong></p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">MediConnect - Your Healthcare Partner</p>
                </div>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({ 
            message: 'OTP sent successfully to your email',
            email: email // Send back for verification page
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Error sending OTP', error: error.message });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Check if OTP exists
        const storedData = otpStore.get(email);
        if (!storedData) {
            return res.status(400).json({ message: 'OTP not found or expired' });
        }

        // Check if OTP has expired
        if (Date.now() > storedData.expiry) {
            otpStore.delete(email);
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Check if OTP has been used
        if (storedData.used) {
            return res.status(400).json({ message: 'OTP has already been used' });
        }

        // Verify OTP
        if (storedData.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Mark OTP as used (but keep it for password reset)
        storedData.used = true;
        otpStore.set(email, storedData);

        res.json({ 
            message: 'OTP verified successfully',
            verified: true
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ message: 'Error verifying OTP', error: error.message });
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Verify OTP was verified
        const storedData = otpStore.get(email);
        if (!storedData || !storedData.used) {
            return res.status(400).json({ message: 'Please verify OTP first' });
        }

        // Check if OTP has expired
        if (Date.now() > storedData.expiry) {
            otpStore.delete(email);
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update password (will be hashed by pre-save hook)
        user.password = newPassword;
        await user.save();

        // Clear OTP from store
        otpStore.delete(email);

        res.json({ 
            message: 'Password reset successfully',
            success: true
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
});

module.exports = router;
