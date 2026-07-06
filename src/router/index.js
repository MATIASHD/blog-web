const express = require('express');
const router = express.Router();

router.use('/', require('./public/index'));
router.use('/dashboard', require('./admin/index'));
router.use('/webhook', require('./webhook/index'));

module.exports = router;
