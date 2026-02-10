const express = require('express');
const router = express.Router();
const User = require('../models/User');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = new User({ username, password });
    await user.save();

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Registration error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // СОЗДАЕМ СЕССИЮ
    req.session.userId = user._id;

    res.json({ message: 'Logged in' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout error' });
    }
    res.json({ message: 'Logged out' });
  });
});

module.exports = router;
