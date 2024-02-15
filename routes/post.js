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
        newsFeed,
        createComment,
        removeComment,
        totalPosts,
        searchUser,
        getUserProfile
      } = require('../controllers/post');

router.get('/user-posts', requireSignin, postByUser);
router.get('/user/post/:_id', requireSignin, userPost);
router.put('/update-post/:_id', requireSignin, canEditDeletePost, userPostUpdate);
router.delete('/delete-post/:_id', requireSignin, canEditDeletePost, deletePost);
router.put('/like-post/:_id', requireSignin, likePost);
router.put('/dislike-post/:_id', requireSignin, dislikePost);
router.get('/news-feed/:page', requireSignin, newsFeed);
router.post('/create-comment', requireSignin, createComment);
router.delete('/user/post/:postId/comment/:commentId', requireSignin, removeComment);
router.get('/total-posts', requireSignin, totalPosts);
router.get('/user/search', requireSignin, searchUser);
router.get('/api/users/:_id', requireSignin, getUserProfile);
module.exports = router;