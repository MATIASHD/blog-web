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

router.get('/login', (req, res) => {
    res.render('pages/login', {
        title: 'login'
    });
});

router.get('/dashboard', (req, res) => {
    res.render('pages/dashboard', {
        title: 'dashboard'
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

router.get('/categoria/:slug', (req, res) => { 
   res.send('Categoria');
});

router.get('/tags/:slug', (req, res) => { 
   res.send('tags')
});

router.get('/search/', (req, res) => { 
   res.send('tags')
});

router.get('/contacto/', (req, res) => { 
   res.send('contacto')
});

router.get('/newsletter/', (req, res) => { 
   res.send('newsletter') //captacion de email
});

router.get('/error/', (req, res) => { 
   res.send('error 404') 
});

module.exports = router;