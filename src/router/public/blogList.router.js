const express = require('express');
const router = express.Router();

const categoryService = require('../../services/category.service');
const tagService = require('../../services/tag.service');
router.get('/categoria/:slug', (req, res) => { 
    const posts = categoryService.getPostsByCategory(req.params.slug);
    res.render('pages/categoria', {
        title: `Categoria: ${req.params.slug}`,
        categoria: req.params.slug,
        categoriaSlug: req.params.slug,
        todasLasCategorias: categoryService.getAll(),
        todosLosTags: tagService.getAll(),
        posts
    });
});

module.exports = router;
