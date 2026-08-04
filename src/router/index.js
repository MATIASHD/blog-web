const express = require('express');
const router = express.Router();

router.use('/', require('./public/index'));
router.use('/api', require('./api/index'));
router.use('/dashboard', require('./admin/index'));
router.use('/webhook', require('./webhook/index'));
router.use('/', require('./system/index'));

module.exports = router;
