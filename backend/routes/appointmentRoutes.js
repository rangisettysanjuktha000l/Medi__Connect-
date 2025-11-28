const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { authMiddleware } = require('../middleware/auth');

// Create appointment (patient only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { doctor, appointmentDate, timeSlot, symptoms, consultationType } = req.body;

        // Check if slot is available
        const existingAppointment = await Appointment.findOne({
            doctor,
            appointmentDate,
            'timeSlot.startTime': timeSlot.startTime,
            status: { $ne: 'cancelled' }
        });

        if (existingAppointment) {
            return res.status(400).json({ message: 'This time slot is already booked' });
        }

        const appointment = new Appointment({
            patient: req.user.userId,
            doctor,
            appointmentDate,
            timeSlot,
            symptoms,
            consultationType: consultationType || 'in-person'
        });

        await appointment.save();
        await appointment.populate('doctor', 'name specialization consultationFee');

        res.status(201).json({
            message: 'Appointment booked successfully',
            appointment
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: 'Error creating appointment', error: error.message });
    }
});

// Get user appointments
router.get('/my-appointments', authMiddleware, async (req, res) => {
    try {
        let query = {};

        if (req.user.role === 'patient') {
            query.patient = req.user.userId;
        } else if (req.user.role === 'doctor') {
            query.doctor = req.user.userId;
        }

        const appointments = await Appointment.find(query)
            .populate('patient', 'name email phone')
            .populate('doctor', 'name specialization consultationFee')
            .sort({ appointmentDate: -1 });

        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
});

// Get appointment by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patient', 'name email phone')
            .populate('doctor', 'name specialization consultationFee');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check authorization
        if (appointment.patient._id.toString() !== req.user.userId &&
            appointment.doctor._id.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        res.json(appointment);
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ message: 'Error fetching appointment', error: error.message });
    }
});

// Update appointment (doctor can add diagnosis/prescription)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { status, diagnosis, prescription, notes } = req.body;

        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Update fields
        if (status) appointment.status = status;
        if (diagnosis) appointment.diagnosis = diagnosis;
        if (prescription) appointment.prescription = prescription;
        if (notes) appointment.notes = notes;

        await appointment.save();
        await appointment.populate('patient', 'name email phone');
        await appointment.populate('doctor', 'name specialization consultationFee');

        res.json({ message: 'Appointment updated successfully', appointment });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ message: 'Error updating appointment', error: error.message });
    }
});

// Cancel appointment
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        appointment.status = 'cancelled';
        await appointment.save();

        res.json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
    }
});

module.exports = router;
