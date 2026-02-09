const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const mongoose = require('mongoose');

// USER MODEL
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send('Fill all fields');
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashed
    });

    await user.save();
    res.send('User created');
  } catch {
    res.status(500).send('Error');
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(401).send('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send('Invalid credentials');

    req.session.user = user._id;
    res.send('Logged in');
  } catch {
    res.status(500).send('Error');
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.send('Logged out');
});
const user = await User.findOne({ username });
const match = await bcrypt.compare(password, user.password);

module.exports = router;
