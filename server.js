const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public')); // фронтенд

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Модель товара
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  size: String,
  category: String
});
const Item = mongoose.model('Item', itemSchema);


// Подключение к MongoDB Compass
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// CRUD эндпоинты

// GET все товары
app.get('/api/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// POST новый товар
app.post('/api/items', async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.json(newItem);
});

// PUT обновить товар
app.put('/api/items/:id', async (req, res) => {
  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedItem);
});

// DELETE удалить товар
app.delete('/api/items/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// Запуск сервера
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));