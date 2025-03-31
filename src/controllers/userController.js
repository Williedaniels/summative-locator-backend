// src/controllers/userController.js
const { User } = require('../models');
const { generateAuthToken } = require('../middleware/authMiddleware');
const bcrypt = require('bcrypt');

class UserController {
  async register(req, res) {
    try {
      const { username, email, password, language = 'en' } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ 
        where: { 
          [Op.or]: [{ email }, { username }] 
        } 
      });

      if (existingUser) {
        return res.status(400).json({ 
          message: 'User already exists with this email or username' 
        });
      }

      // Create new user
      const user = await User.create({
        username,
        email,
        password,
        language
      });

      // Generate authentication token
      const token = generateAuthToken(user);

      res.status(201).json({ 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          language: user.language
        },
        token 
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: 'Invalid login credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid login credentials' });
      }

      // Generate authentication token
      const token = generateAuthToken(user);

      res.json({ 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          language: user.language
        },
        token 
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUserProfile(req, res) {
    try {
      res.json(req.user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateUserProfile(req, res) {
    try {
      const { username, language } = req.body;

      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await user.update({ 
        username, 
        language 
      });

      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateUserLocation(req, res) {
    try {
      const { latitude, longitude } = req.body;

      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await user.update({ 
        location: {
          type: 'Point',
          coordinates: [longitude, latitude]
        }
      });

      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateUserPreferences(req, res) {
    try {
      const { preferences } = req.body;

      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await user.update({ preferences });

      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new UserController();