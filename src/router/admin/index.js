const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/auth');


router.use('/', require('./posts.router'));

module.exports = router;
