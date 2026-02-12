const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../data/database/mongo');

const auth = require('../middleware/authMiddleware');

const router = express.Router();


// GET all
router.get('/', async (req, res) => {
  const db = getDB();
  const items = await db.collection('clothes').find({}).toArray();
  res.json(items);
});


// POST (ЗАЩИЩЕН)
router.post('/', auth, async (req, res) => {
  const { name, brand, price, size, color } = req.body;

  if (!name || !price)
    return res.status(400).json({ error: 'Missing fields' });

  const db = getDB();

  const result = await db.collection('clothes').insertOne({
    name,
    brand,
    price,
    size,
    color,
    createdAt: new Date()
  });

  res.status(201).json(result);
});


// PUT
router.put('/:id', auth, async (req, res) => {
  const db = getDB();

  await db.collection('clothes').updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );

  res.json({ message: 'Updated' });
});


// DELETE
router.delete('/:id', auth, async (req, res) => {
  const db = getDB();

  await db.collection('clothes').deleteOne({
    _id: new ObjectId(req.params.id)
  });

  res.json({ message: 'Deleted' });
});

module.exports = router;
