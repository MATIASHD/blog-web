const express = require('express');
const router = express.Router();

router.get('/categories', (req, res) => {
    res.render('pages/categories', {
        title: 'Categorías'
    });
});

module.exports = router;