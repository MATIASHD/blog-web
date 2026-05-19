const express = require('express');
const router = express.Router();

const postservice = require('../../services/post.service');
router.get('/categoria/:slug', (req, res) => { 
    const posts = postservice.obtenerTodosLosPost();
    res.render('pages/categoria', {
        title: `Categoria: ${req.params.slug}`,
        categoria: req.params.slug,
        categoriaSlug: req.params.slug,
        posts
    });
});

module.exports = router;