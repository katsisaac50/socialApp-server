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
        profileUpdate,
        findPeople,
        followUser,
        userFollowing,
        unfollowUser,
        usersFollowing,
        removeFollower
        } = require('../controllers/auth');
const { userInfo } = require('os');

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
router.put ('/profile-update', requireSignin, profileUpdate);
router.get ('/find-people', requireSignin, findPeople);
router.put ('/follow-user', requireSignin, followUser);
router.get ('/user-following', requireSignin, userFollowing);
// router.delete('/user-unfollow', requireSignin, unfollowUser);
router.put ('/unfollow-user', requireSignin, removeFollower, usersFollowing);



module.exports = router;
