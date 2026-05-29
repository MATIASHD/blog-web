const express = require('express');
const router = express.Router();
const postService = require('../../services/post.service');

router.get('/blog/:slug', (req, res) => {
    const post = postService.getPostBySlug(req.params.slug);
    if (post) {
        res.render('pages/article', {
            title: post.title,
            post
        });
        return;
    }

    res.status(404).render('pages/404', {
        title: 'Post no encontrado'
    });
});

module.exports = router;
