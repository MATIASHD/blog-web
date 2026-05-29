const express = require('express');
const router = express.Router();
const postService = require('../../services/post.service');

router.get('/', (req, res) => {
    const posts = postService.getAllPosts();
    res.render('pages/index', {
        title: 'Home',
        posts
    });
});

module.exports = router;
