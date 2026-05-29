const express = require('express');
const router = express.Router();

router.get('/password/reset', (req, res) => {
  res.render('pages/login', {
    title: 'Recuperar contraseña',
    isPasswordReset: true
  });
});

module.exports = router;
