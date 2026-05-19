const express = require('express');
const router = express.Router();

router.get('/admin/media', (req, res) => {
    res.render('pages/media', {
        title: 'media'
    });
});

module.exports = router;