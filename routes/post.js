const express = require('express');
const router = express.Router();
const {requireSignin, canEditDeletePost} = require('../middlewares');

const {
        postByUser,
        userPost,
        userPostUpdate,
        deletePost,
        likePost,
        dislikePost,
        newsFeed
      } = require('../controllers/post');

router.get('/user-posts', requireSignin, postByUser);
router.get('/user/post/:_id', requireSignin, userPost);
router.put('/update-post/:_id', requireSignin, canEditDeletePost, userPostUpdate);
router.delete('/delete-post/:_id', requireSignin, canEditDeletePost, deletePost);
router.put('/like-post/:_id', requireSignin, likePost);
router.put('/dislike-post/:_id', requireSignin, dislikePost);
router.get('/news-feed', requireSignin, newsFeed);
module.exports = router;