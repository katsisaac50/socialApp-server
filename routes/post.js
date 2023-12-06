const express = require('express');
const router = express.Router();
const {requireSignin} = require('../middlewares');

router.get('/user-posts', requireSignin, postByUser);