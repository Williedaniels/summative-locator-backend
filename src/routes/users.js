const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // Protect the route with auth middleware
const { User } = require('../models'); // Import the User model
const UserController = require('../controllers/userController'); 

router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user.id, {
      attributes: { exclude: ['password'] }, // Exclude the password
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'preferences'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { preferences } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.preferences = preferences;
    await user.save();

    res.json({ message: 'Preferences updated successfully', preferences: user.preferences });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search', UserController.searchProfiles);

router.get('/', UserController.getAllUsers);



module.exports = router;
