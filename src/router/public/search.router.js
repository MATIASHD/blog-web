const express = require('express');
const router = express.Router();
const postService = require('../../services/post.service');

router.get('/search/', (req, res) => { 
    const query = req.query.q || '';
    const posts = query ? postService.searchPosts(query) : postService.getAllPosts();
    res.render('pages/search', {
        title: 'Busqueda',
        query,
        posts
    });
});

module.exports = router;
