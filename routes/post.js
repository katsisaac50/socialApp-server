const express = require('express');
const router = express.Router();
const {requireSignin} = require('../middlewares');

const {
        postByUser, postLikes
      } = require('../controllers/post');

router.get('/user-posts', requireSignin, postByUser);
router.post('/user-likes', requireSignin, postLikes);

module.exports = router;