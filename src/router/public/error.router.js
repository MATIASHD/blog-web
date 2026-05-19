const express = require('express');
const router = express.Router();

router.get('/error/', (req, res) => { 
    res.render('pages/error', {
        title: 'Error'
    });
});

module.exports = router;