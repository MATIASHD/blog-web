const express = require('express');
const router = express.Router();

router.get('/admin/contacts', (req, res) => {
    res.render('pages/contacts', {
        title: 'Contactos'
    });
});

module.exports = router;