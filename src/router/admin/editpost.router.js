const express = require('express');
const router = express.Router();

router.get('/admin/posts/:id/edit', (req, res) => {
    res.render('pages/posts', {
        title: 'dashboard'
    });
});

module.exports = router;