const express = require('express');
const router = express.Router();

// Importar todos los routers de autenticación
router.use('/', require('./login.router'));
//router.use('/', require('./register.router'));
//router.use('/', require('./password.router'));
//router.use('/', require('./reset-password.router'));


module.exports = router;
