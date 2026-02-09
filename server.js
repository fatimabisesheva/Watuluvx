const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');

dotenv.config();

const app = express();

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'your_secret_key_123',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false // true только если HTTPS
  }
}));

// ===== AUTH ROUTES =====
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// ===== ENV =====
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ===== MONGODB =====
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// ===== AUTH MIDDLEWARE =====
function authMiddleware(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// ===== MODEL (DOMAIN DATA) =====
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  size: String,
  brand: String,
  category: String,
  stock: Number,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// ===== TEST ROUTE =====
app.get('/test', (req, res) => {
  res.send('Server is working!');
});

// ===== CRUD =====

// GET ALL (ОТКРЫТ)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'GET failed' });
  }
});

// CREATE (ЗАЩИЩЁН)
app.post('/api/products', authMiddleware, async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Name required' });
    }

    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Create failed' });
  }
});

// UPDATE (ЗАЩИЩЁН)
app.put('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// DELETE (ЗАЩИЩЁН)
app.delete('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// ===== ROOT =====
app.get('/', (req, res) => {
  res.send('API is running');
});

// ===== START =====
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
