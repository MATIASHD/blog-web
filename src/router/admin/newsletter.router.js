const express = require('express');
const router = express.Router();

router.get('/admin/newsletter', (req, res) => {
    res.render('pages/newsletter', {
        title: 'Newsletter'
    });
});

module.exports = router;