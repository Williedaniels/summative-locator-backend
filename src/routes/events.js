// src/routes/events.js
const express = require('express');
const router = express.Router();
const { Event } = require('../models'); // Using your existing model structure
const auth = require('../middlewares/auth'); 
const EventController = require('../controllers/eventController');
const logger = require('../services/logger');
const { Op } = require('sequelize');

/**
 * GET all events
 * Route: GET /api/events
 */
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll();
    logger.info(`Retrieved ${events.length} events`);
    return res.status(200).json(events);
  } catch (error) {
    logger.error(`Error fetching events: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET single event by ID
 * Route: GET /api/events/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    
    if (!event) {
      logger.warn(`Event with ID ${req.params.id} not found`);
      return res.status(404).json({ message: 'Event not found' });
    }
    
    logger.info(`Retrieved event with ID ${req.params.id}`);
    return res.status(200).json(event);
  } catch (error) {
    logger.error(`Error fetching event ${req.params.id}: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Search events by query parameters
 * Route: GET /api/events/search
 * Query params: title, location, startDate, endDate
 */
router.get('/search', async (req, res) => {
  try {
    const { title, location, startDate, endDate } = req.query;
    const whereClause = {};
    
    if (title) whereClause.title = { [Op.iLike]: `%${title}%` };
    if (location) whereClause.location = { [Op.iLike]: `%${location}%` };
    
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereClause.date = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      whereClause.date = { [Op.lte]: new Date(endDate) };
    }
    
    const events = await Event.findAll({ where: whereClause });
    
    logger.info(`Search found ${events.length} events`);
    return res.status(200).json(events);
  } catch (error) {
    logger.error(`Error searching events: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * CREATE a new event
 * Route: POST /api/events
 */
router.post('/', async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    
    // Validate required fields
    if (!title || !date) {
      return res.status(400).json({ message: 'Title and date are required fields' });
    }
    
    // Create the event
    const event = await Event.create({
      title,
      description,
      date,
      location
    });
    
    logger.info(`Event created with ID ${event.id}`);
    return res.status(201).json(event);
  } catch (error) {
    logger.error(`Error creating event: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/search', EventController.searchEvents);
router.get('/:id', EventController.getEventById);
router.post('/', EventController.createEvent);

/**
 * UPDATE an existing event
 * Route: PUT /api/events/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    
    // Find the event first
    const event = await Event.findByPk(req.params.id);
    
    if (!event) {
      logger.warn(`Event with ID ${req.params.id} not found for update`);
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Update the event
    await event.update({
      title: title || event.title,
      description: description || event.description,
      date: date || event.date,
      location: location || event.location
    });
    
    logger.info(`Event ${req.params.id} updated successfully`);
    return res.status(200).json(event);
  } catch (error) {
    logger.error(`Error updating event ${req.params.id}: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE an event
 * Route: DELETE /api/events/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    // Find the event first
    const event = await Event.findByPk(req.params.id);
    
    if (!event) {
      logger.warn(`Event with ID ${req.params.id} not found for deletion`);
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Delete the event
    await event.destroy();
    
    logger.info(`Event ${req.params.id} deleted successfully`);
    return res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting event ${req.params.id}: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;