// server.js
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const mongoose = require('mongoose');
const MongoStore = require('connect-mongo').default;
const pageAuth = require('./middleware/pageAuth');

const app = express();

// ===== Middleware =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ===== Сессии =====
app.use(session({
    secret: process.env.SESSION_SECRET || 'secretkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions'
    }),
    cookie: { httpOnly: true, secure: false, maxAge: 1000*60*60*24 }
}));

// ===== Подключение к MongoDB =====
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
    console.error('❌ DB connection error:', err);
    process.exit(1);
});

// ===== Роуты =====
app.use('/auth', require('./routes/auth'));

// ===== Страницы =====
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));

// Все страницы после логина защищены
app.get('/home', pageAuth, (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/about', pageAuth, (req, res) => res.sendFile(path.join(__dirname, 'public', 'about.html')));
app.get('/contact', pageAuth, (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));

// ===== 404 =====
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// ===== Запуск сервера =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
