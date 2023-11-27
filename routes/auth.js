const express = require('express');
const router = express.Router();

// middlewares
const {requireSignin} = require('../middlewares');

// controllers
const {register, login, currentUser} = require('../controllers/auth');

// routes
router.post('/register', register);
router.post('/login', login);
router.get('/current-user', requireSignin, currentUser);


module.exports = router;
