const express = require('express');
const router = express.Router();
const multer = require('multer');
const { adminController } = require('../../controllers');
const { requireAuth, requireAdmin } = require('../../middleware');
const postsRouter = require('./posts.router');

const upload = multer({ storage: multer.memoryStorage() });

router.use(requireAuth);
router.use(requireAdmin);

router.get('/', adminController.dashboard);
router.get('/users', adminController.users);
router.get('/media', adminController.media);
router.get('/settings', adminController.dashboard);

router.use('/posts', postsRouter);

router.get('/users/new', adminController.newUser);
router.post('/users/new', adminController.createUser);
router.get('/users/:id/edit', adminController.editUser);
router.post('/users/:id/edit', adminController.updateUser);
router.post('/users/:id/delete', adminController.deleteUser);
router.post('/users/delete-batch', adminController.deleteUsersBatch);

router.post('/media/upload', upload.single('file'), adminController.uploadMedia);
router.post('/media/update', adminController.updateMedia);
router.post('/media/delete', adminController.deleteMedia);

module.exports = router;
