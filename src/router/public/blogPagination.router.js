const express = require('express');
const router = express.Router();
const postservice = require('../../services/post.service');

router.get('/blog', (req, res) => { 
    const posts = postservice.obtenerTodosLosPost();
    res.render('pages/blog', {
        title: 'Blog',
        posts,
        paginaActual: 1,
        totalPaginas: 1
    });
});

module.exports = router;