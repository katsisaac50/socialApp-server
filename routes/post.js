const express = require('express');
const router = express.Router();
const {requireSignin, canEditDeletePost} = require('../middlewares');

const {
        postByUser,
        postLikes,
        userPost,
        userPostUpdate
      } = require('../controllers/post');

router.get('/user-posts', requireSignin, postByUser);
router.post('/user-likes', requireSignin, postLikes);
router.get("/user/post/:_id", requireSignin, userPost)
router.put("/update-post/:_id", requireSignin, canEditDeletePost, userPostUpdate);

module.exports = router;