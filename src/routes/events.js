// src/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/auth');
const { Event } = require('../models'); // Import the Event model

// Protected routes
router.post('/', eventController.createEvent);
router.get('/search', eventController.searchEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

// Add a route to fetch all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
