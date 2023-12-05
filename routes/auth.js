const express = require('express');
const router = express.Router();

// middlewares
const {requireSignin} = require('../middlewares');

// controllers
const {
        register, 
        createPost, 
        login, 
        currentUser, 
        forgotPassword
        } = require('../controllers/auth');

// routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/current-user', requireSignin, currentUser);
router.post('/create-post', requireSignin, createPost);


module.exports = router;
