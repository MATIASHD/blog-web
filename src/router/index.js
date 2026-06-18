const express = require('express');
const router = express.Router();

router.use('/', require('./public'));
//router.use('/', require('./auth'));
//router.use('/admin', require('./admin'));
//router.use('/', require('./seo'));
//router.use('/', require('./system'));


module.exports = router;
