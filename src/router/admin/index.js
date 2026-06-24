const express = require('express');
const router = express.Router();
const { adminController } = require('../../controllers');

router.get('/', adminController.dashboard);
router.get('/users', adminController.users);
router.get('/media', adminController.media);
router.get('/posts', adminController.posts);
router.get('/settings', adminController.dashboard);

module.exports = router;
