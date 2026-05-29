const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/auth.controller');

router.get('/register', authController.getRegisterForm);
router.post('/register', authController.register);

module.exports = router;
