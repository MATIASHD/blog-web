const express = require('express');
const router = express.Router();
const contactService = require('../../services/contact.service');

router.get('/contacto/', (req, res) => { 
    res.render('pages/contact', {
        title: 'Contacto'
    });
});

router.post('/contacto', (req, res, next) => {
    try {
        contactService.createContact({
            name: req.body.name || req.body.nombre,
            email: req.body.email,
            subject: req.body.subject || req.body.asunto,
            message: req.body.message || req.body.mensaje
        });

        res.render('pages/contact', {
            title: 'Contacto',
            mensaje: 'Mensaje enviado correctamente.'
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
