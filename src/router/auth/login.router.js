const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('pages/login', {
        title: 'login'
    });
});

module.exports = router;