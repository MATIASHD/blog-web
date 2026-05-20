const express = require('express');
const router = express.Router();
const { contactoController } = require('../../controllers/admin/contacto.controller');

router.get('/admin/contacts', contactoController);

module.exports = router;