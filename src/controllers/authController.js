const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../services/logger'); // Import the logger

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );
};

class AuthController {
  async register(req, res) {
    try {
      const { username, email, password, location, language } = req.body;
      const user = await User.create({
        username,
        email,
        password,
        location,
        language,
      });

      res.status(201).json({
        message: req.t('user_registered'),
        userId: user.id,
        token: generateToken(user),
      });
    } catch (error) {
      logger.error('Error registering user:', error); // Use the logger
      res.status(500).json({ message: req.t('registration_failed') });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user || !(await user.validPassword(password))) {
        return res.status(401).json({ message: req.t('auth_failed') });
      }

      res.json({
        message: req.t('login_success'),
        userId: user.id,
        token: generateToken(user),
      });
    } catch (error) {
      logger.error('Error logging in user:', error); // Use the logger
      res.status(500).json({ message: req.t('login_failed') });
    }
  }
}

module.exports = new AuthController();
