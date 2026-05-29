const express = require('express');
const router = express.Router();
const tagService = require('../../services/tag.service');
const categoryService = require('../../services/category.service');

router.get('/tags/:slug', (req, res) => {
    const posts = tagService.getPostsByTag(req.params.slug);
    res.render('pages/tags', {
        title: `Tag: ${req.params.slug}`,
        tag: req.params.slug,
        tagSlug: req.params.slug,
        todasLasCategorias: categoryService.getAll(),
        todosLosTags: tagService.getAll(),
        posts
    });
});

module.exports = router;
