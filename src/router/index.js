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

router.get('/admin', (req, res) => {
    res.render('pages/dashboard', {
        title: 'dashboard'
    });
});

router.get('/admin/posts', (req, res) => {
    res.render('pages/dashboard', {
        title: 'dashboard'
    });
});
router.get('/admin/posts/new', (req, res) => {
    res.render('pages/dashboard', {
        title: 'dashboard'
    });
});
router.get('/admin/posts/:id/edit', (req, res) => {
    res.render('pages/posts', {
        title: 'dashboard'
    });
});

router.get('/admin/media', (req, res) => {
    res.render('pages/media', {
        title: 'media'
    });
});

router.get('/admin/categories', (req, res) => {
    res.render('pages/categories', {
        title: 'media'
    });
});

router.get('/admin/tags', (req, res) => {
    res.render('pages/tags', {
        title: 'media'
    });
});

router.get('/admin/newsletter', (req, res) => {
    res.render('pages/newsletter', {
        title: 'media'
    });
});

router.get('/admin/contacts', (req, res) => {
    res.render('pages/contacts', {
        title: 'media'
    });
});

router.get('/admin/settings', (req, res) => {
    res.render('pages/contacts', {
        title: 'media'
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
   res.render('pages/category',{
    title: 'Categoria',
    slug: req.params.slug
   });
});

router.get('/tags/:slug', (req, res) => { 
   res.render('pages/tags',{
    title: 'Etiquetas',
    slug: req.params.slug
   });
});

router.get('/search/', (req, res) => { 
   res.render('pages/search',{
    title: 'busqueda'
   });
});

router.get('/contacto/', (req, res) => { 
   res.render('pages/contacto',{
    title: Contacto
   });
});

router.get('/newsletter/', (req, res) => { 
   res.render('pages/newsletter',{
    title: 'Newsletter'
   });
});

router.get('/forgot-password/:token', (req, res) => { 
   res.render('pages/reset-password', {
    token: req.params.token
   });
});

router.get('/error/', (req, res) => { 
   res.send('pages/404',{
    title: 'Error 404'
   });
});

module.exports = router;