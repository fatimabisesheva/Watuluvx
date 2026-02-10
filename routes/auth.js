const express = require('express');
const router = express.Router();
const User = require('../models/User'); // модель пользователя
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // проверка
    if (!username || !password) {
      return res.json({ message: 'Заполните поля' });
    }

    // есть ли уже такой юзер
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ message: 'Пользователь уже существует' });
    }

    // хеш пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();

    res.json({ message: 'Регистрация успешна' });

  } catch (err) {
    res.json({ message: 'Ошибка регистрации' });
  }
});

module.exports = router;
