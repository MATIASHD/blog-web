const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/authController');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos. Intente de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/auth/login', loginLimiter, authController.login);
router.post('/auth/refresh', authController.refresh);
router.post('/auth/logout', authController.logout);

module.exports = router;
