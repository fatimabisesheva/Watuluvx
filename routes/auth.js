const express = require('express');
const bcrypt = require('bcrypt');
const { getDB } = require('../data/database/mongo');


const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const db = getDB();

  await db.collection('users').insertOne({
    username,
    password: hashed
  });

  res.json({ message: 'Registered' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const db = getDB();

  const user = await db.collection('users').findOne({ username });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  req.session.userId = user._id;

  res.json({ message: 'Logged in' });
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

module.exports = router;
