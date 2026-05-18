const express = require('express');
const router = express.Router();

router.get('/admin', (req, res) => {
    res.render('pages/dashboard', {
        title: 'dashboard'
    });
});

module.exports = router;