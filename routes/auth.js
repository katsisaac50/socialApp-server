const express = require('express');

const router = express.Router();

router.post('/register', (req, res) => {

    console.log('Register =>', req.body);
    res.status(200).json({ message: 'Registration successful' });

});

module.exports = router;
