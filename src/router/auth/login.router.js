const express = require('express');
const router = express.Router();

const { login, passwordReset } = require('../../controllers');

router.get('/login', login);
router.get('/password-reset', passwordReset);

module.exports = router;
