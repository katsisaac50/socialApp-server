const express = require('express');
const router = express.Router();
const {requireSignin} = require('../middlewares');

const {
        postByUser
      } = require('../controllers/post');

router.get('/user-posts', requireSignin, postByUser);