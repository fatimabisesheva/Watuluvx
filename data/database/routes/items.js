const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../database/mongo');

const router = express.Router();

// GET all (filter, sort, projection)
router.get('/', async (req, res) => {
  const db = getDB();
  const items = await db.collection('items')
    .find({})
    .project({ title: 1, description: 1 })
    .sort({ _id: 1 })
    .toArray();

  res.status(200).json(items);
});

// GET by id
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const item = await db.collection('items').findOne({
      _id: new ObjectId(req.params.id)
    });

    if (!item) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(item);
  } catch {
    res.status(400).json({ error: 'Invalid id' });
  }
});

// POST
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description)
    return res.status(400).json({ error: 'Missing fields' });

  const db = getDB();
  const result = await db.collection('items').insertOne({ title, description });

  res.status(201).json(result);
});

// PUT
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('items').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ error: 'Not found' });

    res.status(200).json({ message: 'Updated' });
  } catch {
    res.status(400).json({ error: 'Invalid id' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('items').deleteOne({
      _id: new ObjectId(req.params.id)
    });

    if (result.deletedCount === 0)
      return res.status(404).json({ error: 'Not found' });

    res.status(200).json({ message: 'Deleted' });
  } catch {
    res.status(400).json({ error: 'Invalid id' });
  }
});

module.exports = router;
