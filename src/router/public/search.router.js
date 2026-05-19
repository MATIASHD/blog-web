const express = require('express');
const router = express.Router();
const postservice = require('../../services/post.service');

router.get('/search/', (req, res) => { 
    const posts = postservice.obtenerTodosLosPost();
    res.render('pages/search', {
        title: 'Busqueda',
        query: req.query.q || '',
        posts
    });
});

module.exports = router;