const express = require('express');
const router = express.Router();
const mediaController = require('../../controllers/admin/media.controller');

router.get('/media', mediaController.getMediaList);
router.post('/media/:filename/delete', mediaController.deleteMedia);

module.exports = router;
