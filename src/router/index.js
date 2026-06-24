const express = require('express');
const router = express.Router();

router.use('/', require('./public/index'));
router.use('/dashboard', require('./admin/index'));


module.exports = router;
