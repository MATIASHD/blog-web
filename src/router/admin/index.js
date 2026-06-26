const express = require('express');
const router = express.Router();
const { adminController } = require('../../controllers');
const { llegueMiddleware } = require('../../middleware');

router.get('/', adminController.dashboard);
router.get('/users', adminController.users);
router.get('/media', adminController.media);
router.get('/posts', adminController.posts);
router.get('/settings', adminController.dashboard);

router.get('/users/new', adminController.newUser);
router.post('/users/new', llegueMiddleware, adminController.createUser);
/*router.get('/users/:id/edit', adminController.editUser);
router.post('/users/:id/edit', adminController.updateUser);
router.post('/users/:id/delete', adminController.deleteUser);*/

module.exports = router;

