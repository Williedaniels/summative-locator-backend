const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../services/logger');

class AuthController {
  async register(req, res) {
    try {
      const { username, email, password, country, language } = req.body;
      
      // Validate required fields
      if (!username || !email || !password) {
        return res.status(400).json({ 
          success: false,
          message: req.t('missing_required_fields')
        });
      }

      // Create user (password is automatically hashed by model hook)
      const user = await User.create({
        username,
        email,
        password, // Will be hashed by beforeCreate hook
        country,
        language
      });

      // Return success response without token
      res.status(201).json({
        success: true,
        message: req.t('user_registered'),
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          language: user.language
        }
      });

    } catch (error) {
      logger.error('Registration error:', error);
      
      // Handle Sequelize validation errors
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          success: false,
          message: req.t('user_already_exists')
        });
      }
      
      res.status(500).json({
        success: false,
        message: req.t('registration_error'),
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: req.t('email_and_password_required')
        });
      }

      const user = await User.findOne({ where: { email } });
      
      if (!user || !(await user.validPassword(password))) {
        return res.status(401).json({
          success: false,
          message: req.t('invalid_credentials')
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || '24h' }
      );

      res.json({
        success: true,
        message: req.t('login_success'),
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          language: user.language
        },
        token
      });

    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: req.t('login_error'),
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new AuthController();