const express = require('express');
const router = express.Router();

// Importar todos los routers de admin
router.use('/', require('./dashboard.router'));
router.use('/', require('./posts.router'));
router.use('/', require('./newpost.router'));
router.use('/', require('./editpost.router'));
router.use('/', require('./media.router'));
router.use('/', require('./contacto.router'));
router.use('/', require('./newsletter.router'));
router.use('/', require('./settings.router'));

module.exports = router;
