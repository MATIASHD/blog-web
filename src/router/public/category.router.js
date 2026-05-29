const express = require('express');
const router = express.Router();

router.get('/categories', (req, res) => {
  res.redirect('/blog');
});

module.exports = router;
