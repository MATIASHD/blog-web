const express = require('express');
const router = express.Router();

router.get('/admin/settings', (req, res) => {
    res.render('pages/settings', {
        title: 'Settings'
    });
});
module.exports = router;