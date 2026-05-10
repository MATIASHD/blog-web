const express = require('express');
const router = express.Router();
const postservice = require('../services/post.service');


router.get('/', (req, res) => {
    const posts = postservice.obtenerTodosLosPost();
    res.render('pages/index', {
        title: 'Home',
        posts
    });
});

router.get('/about', (req, res) => {
    res.render('pages/about', {
        title: 'About'
    });
});

router.get('/blog/:slug', (req, res) => { 
    try {
        const post = postservice.obtenerPost(req.params.slug);
        res.render('pages/article', {
            title: post.titulo,
            post
        });
    } catch(e){
        console.error(e);
        res.status(404).render('pages/404',{
            title: 'Post no encontrado'
        });
    }
});

module.exports = router;