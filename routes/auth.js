const express = require('express');
const router = express.Router();
const formidableMiddleware = require('express-formidable');

// middlewares
const {requireSignin} = require('../middlewares');

// controllers
const {
        register,
        createPost, 
        login, 
        currentUser, 
        forgotPassword,
        imageUpload,
        profileUpdate
        } = require('../controllers/auth');

// routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/current-user', requireSignin, currentUser);
router.post('/create-post', requireSignin, createPost);
router.post (
        '/upload-image', 
        requireSignin,
        formidableMiddleware({maxFileSize: 5 * 1024 * 1024}),
        imageUpload
        );
router.put ('/profile-update', requireSignin, profileUpdate)



module.exports = router;
