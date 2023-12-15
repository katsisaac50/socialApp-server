const express = require('express');
const router = express.Router();
const {requireSignin} = require('../middlewares');

const {
        postByUser,
        postLikes,
        userPost
      } = require('../controllers/post');

router.get('/user-posts', requireSignin, postByUser);
router.post('/user-likes', requireSignin, postLikes);
router.get("/user/post/:__dirname", userPost)

module.exports = router;