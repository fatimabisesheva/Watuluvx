const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { connectDB } = require('./data/database/mongo');
const pageAuth = require('./middleware/pageAuth');



const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false
  }
}));

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});


app.use('/auth', require('./routes/auth'));
app.use('/clothes', require('./routes/clothes'));

connectDB().then(() => {
  app.listen(3000, () => console.log('Server running'));
});
app.get('/home', pageAuth, (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/about', pageAuth, (req, res) => {
  res.sendFile(__dirname + '/views/about.html');
});

app.get('/contact', pageAuth, (req, res) => {
  res.sendFile(__dirname + '/views/contact.html');
});

