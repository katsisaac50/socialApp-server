const express = require('express');
const router = express.Router();
const {requireSignin, canEditDeletePost} = require('../middlewares');

const {
        postByUser,
        userPost,
        userPostUpdate,
        deletePost,
        likePost,
        dislikePost
      } = require('../controllers/post');

router.get('/user-posts', requireSignin, postByUser);
router.get('/user/post/:_id', requireSignin, userPost);
router.put('/update-post/:_id', requireSignin, canEditDeletePost, userPostUpdate);
router.delete('/delete-post/:_id', requireSignin, canEditDeletePost, deletePost);
router.post('/like-post/:_id', requireSignin, likePost);
router.post('/dislike-post/:_id', requireSignin, dislikePost)

module.exports = router;