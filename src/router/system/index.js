const express = require('express');
const router = express.Router();

// Rutas de sistema
router.get('/healthcheck', (req, res) => {
    res.json({ status: 'ok' });
});

// TODO: Implementar routers de sistema
// - 404 custom
// - 403 forbidden
// - 500 error

module.exports = router;
