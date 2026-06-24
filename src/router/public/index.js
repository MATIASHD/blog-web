const express = require('express');
const router = express.Router();
const { homeController, postController } = require('../../controllers');

router.get('/', homeController.index);
router.get('/about', homeController.about);
router.get('/contact', homeController.contact);
router.get('/newsletter', homeController.newsletter);
router.get('/login', homeController.login);
router.get('/passwordReset', homeController.passwordReset);
router.get('/post/:slug', postController.post);

module.exports = router;
