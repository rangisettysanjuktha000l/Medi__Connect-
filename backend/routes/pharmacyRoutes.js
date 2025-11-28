const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const Order = require('../models/Order');
const { authMiddleware, authorize } = require('../middleware/auth');

// Get all medicines
router.get('/medicines', async (req, res) => {
    try {
        const { category, search } = req.query;

        let query = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { genericName: { $regex: search, $options: 'i' } }
            ];
        }

        const medicines = await Medicine.find(query).sort({ name: 1 });
        res.json(medicines);
    } catch (error) {
        console.error('Error fetching medicines:', error);
        res.status(500).json({ message: 'Error fetching medicines', error: error.message });
    }
});

// Get medicine by ID
router.get('/medicines/:id', async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);

        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        res.json(medicine);
    } catch (error) {
        console.error('Error fetching medicine:', error);
        res.status(500).json({ message: 'Error fetching medicine', error: error.message });
    }
});

// Create medicine (pharmacist/admin only)
router.post('/medicines', authMiddleware, authorize('pharmacist', 'admin'), async (req, res) => {
    try {
        const medicine = new Medicine(req.body);
        await medicine.save();

        res.status(201).json({
            message: 'Medicine added successfully',
            medicine
        });
    } catch (error) {
        console.error('Error creating medicine:', error);
        res.status(500).json({ message: 'Error creating medicine', error: error.message });
    }
});

// Update medicine (pharmacist/admin only)
router.put('/medicines/:id', authMiddleware, authorize('pharmacist', 'admin'), async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        res.json({ message: 'Medicine updated successfully', medicine });
    } catch (error) {
        console.error('Error updating medicine:', error);
        res.status(500).json({ message: 'Error updating medicine', error: error.message });
    }
});

// Create order
router.post('/orders', authMiddleware, async (req, res) => {
    try {
        const { items, deliveryAddress, prescriptionUrl } = req.body;

        // Calculate total amount
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const medicine = await Medicine.findById(item.medicine);
            if (!medicine) {
                return res.status(404).json({ message: `Medicine ${item.medicine} not found` });
            }

            if (medicine.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${medicine.name}` });
            }

            orderItems.push({
                medicine: medicine._id,
                quantity: item.quantity,
                price: medicine.price
            });

            totalAmount += medicine.price * item.quantity;
        }

        const order = new Order({
            patient: req.user.userId,
            items: orderItems,
            totalAmount,
            deliveryAddress,
            prescriptionUrl
        });

        await order.save();
        await order.populate('items.medicine', 'name price');

        res.status(201).json({
            message: 'Order placed successfully',
            order
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
});

// Get user orders
router.get('/orders', authMiddleware, async (req, res) => {
    try {
        let query = {};

        if (req.user.role === 'patient') {
            query.patient = req.user.userId;
        }

        const orders = await Order.find(query)
            .populate('patient', 'name email phone')
            .populate('items.medicine', 'name price')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

// Update order status (pharmacist only)
router.put('/orders/:id', authMiddleware, authorize('pharmacist', 'admin'), async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status,
                verifiedBy: req.user.userId
            },
            { new: true }
        )
            .populate('patient', 'name email phone')
            .populate('items.medicine', 'name price');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update medicine stock if order is verified
        if (status === 'verified') {
            for (const item of order.items) {
                await Medicine.findByIdAndUpdate(
                    item.medicine._id,
                    { $inc: { stock: -item.quantity } }
                );
            }
        }

        res.json({ message: 'Order updated successfully', order });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
});

module.exports = router;
