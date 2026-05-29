const express = require('express');
const router = express.Router();
const postService = require('../../services/post.service');
const categoryService = require('../../services/category.service');
const tagService = require('../../services/tag.service');

router.get('/blog', (req, res) => { 
    const posts = postService.getAllPosts();
    res.render('pages/blog', {
        title: 'Blog',
        posts,
        todasLasCategorias: categoryService.getAll(),
        todosLosTags: tagService.getAll(),
        paginaActual: 1,
        totalPaginas: 1
    });
});

module.exports = router;
