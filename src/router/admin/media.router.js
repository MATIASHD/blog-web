const express = require('express');
const router = express.Router();
const { mediaController } = require('../../controllers/admin/media.controller');

router.get('/admin/media', mediaController);

module.exports = router;