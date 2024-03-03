const express = require('express');
const router = express.Router();
const {requireSignin, canEditDeletePost, isAdmin} = require('../middlewares');

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
        getUserProfile,
        posts,
        getPost,
      } = require('../controllers/post');

router.get('/user-posts', requireSignin, postByUser);
router.get('/user/post/:_id', requireSignin, userPost);
router.put('/update-post/:_id', requireSignin, canEditDeletePost, userPostUpdate);
 router.delete('/admin/delete-post/:_id', requireSignin, isAdmin, deletePost);
router.delete('/delete-post/:_id', requireSignin, canEditDeletePost, deletePost);
router.put('/like-post/:_id', requireSignin, likePost);
router.put('/dislike-post/:_id', requireSignin, dislikePost);
router.get('/news-feed/:page', requireSignin, newsFeed);
router.post('/create-comment', requireSignin, createComment);
router.delete('/user/post/:postId/comment/:commentId', requireSignin, removeComment);
router.get('/total-posts', requireSignin, totalPosts);
router.get('/user/search', requireSignin, searchUser);
router.get('/api/users/:_id', requireSignin, getUserProfile);
router.get('/posts', posts);
router.get('/post/view/:_id', getPost);
module.exports = router;