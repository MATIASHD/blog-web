const express = require('express');
const router = express.Router();

router.get('/tags', (req, res) => {
    res.render('pages/tags', {
        title: 'Etiquetas'
    });
});

module.exports = router;