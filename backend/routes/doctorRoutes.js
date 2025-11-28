const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// Get all doctors
router.get('/', async (req, res) => {
    try {
        const { specialization, search } = req.query;

        let query = { role: 'doctor' };

        // Filter by specialization
        if (specialization) {
            query.specialization = { $regex: specialization, $options: 'i' };
        }

        // Search by name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const doctors = await User.find(query)
            .select('-password')
            .sort({ name: 1 });

        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Error fetching doctors', error: error.message });
    }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
    try {
        const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' })
            .select('-password');

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.json(doctor);
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).json({ message: 'Error fetching doctor', error: error.message });
    }
});

// Update doctor profile (protected route)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { specialization, qualifications, experience, consultationFee, availableSlots } = req.body;

        // Check if user is updating their own profile
        if (req.user.userId !== req.params.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to update this profile' });
        }

        const doctor = await User.findOneAndUpdate(
            { _id: req.params.id, role: 'doctor' },
            { specialization, qualifications, experience, consultationFee, availableSlots },
            { new: true }
        ).select('-password');

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.json({ message: 'Profile updated successfully', doctor });
    } catch (error) {
        console.error('Error updating doctor:', error);
        res.status(500).json({ message: 'Error updating doctor', error: error.message });
    }
});

module.exports = router;
