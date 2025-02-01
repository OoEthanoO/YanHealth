const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  const {username, email, password} = req.body;
  try {
    const user = new User({username, email, password});
    await user.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post('/login', async (req, res) => {
  const {username, password} = req.body;
  try {
    const user = await User.findOne({username});
    if (!user) return res.status(400).send('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({id: user._id}, 'your_jwt_secret', {
      expiresIn: '1h',
    });
    res.json({token});
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
