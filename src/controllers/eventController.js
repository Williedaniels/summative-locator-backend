// src/controllers/eventController.js
const { Event, User, sequelize } = require('../models');
const { Op, fn, col } = require('sequelize');
const logger = require('../services/logger'); // Import the logger

class EventController {
  // Create a new event
  async createEvent(req, res) {
    try {
      const {
        title,
        description,
        location,
        startDateTime,
        category,
        maxParticipants
      } = req.body;

      const event = await Event.create({
        title,
        description,
        location: fn('ST_GeomFromText', `POINT(${location.longitude} ${location.latitude})`), // Use ST_GeomFromText
        startDateTime,
        category,
        maxParticipants,
        userId: req.user.id
      });

      res.status(201).json(event);
    } catch (error) {
      logger.error('Error creating event:', error); // Use the logger
      res.status(400).json({ error: error.message });
    }
  }

  // Search events within a radius
  async searchEvents(req, res) {
    try {
      const {
        latitude,
        longitude,
        radius = 10,
        category
      } = req.query;

      const whereClause = {
        [Op.and]: [
          fn(
            'ST_DWithin',
            col('location'),
            fn('ST_GeomFromText', `POINT(${longitude} ${latitude})`),
            radius * 1609.34 // Convert miles to meters
          )
        ]
      };

      if (category) {
        whereClause.category = category;
      }

      const events = await Event.findAll({
        where: whereClause,
        include: [{
          model: User,
          as: 'creator',
          attributes: ['username']
        }]
      });

      res.json(events);
    } catch (error) {
      logger.error('Error searching events:', error); // Use the logger
      res.status(500).json({ error: error.message });
    }
  }

  // Get an event by ID
  async getEventById(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findByPk(id, {
        include: [{
          model: User,
          as: 'creator',
          attributes: ['username']
        }]
      });

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.json(event);
    } catch (error) {
      logger.error('Error getting event by ID:', error); // Use the logger
      res.status(500).json({ error: error.message });
    }
  }

  // Update an event
  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const { location } = req.body;
      const event = await Event.findByPk(id);

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      if (event.userId !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      // Update the location if provided
      if (location) {
        req.body.location = fn('ST_GeomFromText', `POINT(${location.longitude} ${location.latitude})`);
      }

      await event.update(req.body);
      res.json(event);
    } catch (error) {
      logger.error('Error updating event:', error); // Use the logger
      res.status(400).json({ error: error.message });
    }
  }

  // Delete an event
  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findByPk(id);

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      if (event.userId !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      await event.destroy();
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting event:', error); // Use the logger
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new EventController();
