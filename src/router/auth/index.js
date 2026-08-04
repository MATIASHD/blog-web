const express = require('express');
const router = express.Router();

router.use('/', require('./login.router'));

module.exports = router;
