const express = require('express');
const router = express.Router();

router.use('/', require('./public'));
router.use('/', require('./auth'));
router.use('/admin', require('./admin'));
router.use('/', require('./seo'));
router.use('/', require('./system'));






/*const postservice = require('../services/post.service');










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

router.get('/blog', (req, res) => { 
    const posts = postservice.obtenerTodosLosPost();
    res.render('pages/blog', {
        title: 'Blog',
        posts,
        paginaActual: 1,
        totalPaginas: 1
    });
});

router.get('/categoria/:slug', (req, res) => { 
    const posts = postservice.obtenerTodosLosPost();
    res.render('pages/categoria', {
        title: `Categoria: ${req.params.slug}`,
        categoria: req.params.slug,
        categoriaSlug: req.params.slug,
        posts
    });
});

router.get('/tags/:slug', (req, res) => { 
    const posts = postservice.obtenerTodosLosPost();
    res.render('pages/tags', {
        title: `Tag: ${req.params.slug}`,
        tag: req.params.slug,
        tagSlug: req.params.slug,
        posts
    });
});

router.get('/search/', (req, res) => { 
    const posts = postservice.obtenerTodosLosPost();
    res.render('pages/search', {
        title: 'Busqueda',
        query: req.query.q || '',
        posts
    });
});

router.get('/contacto/', (req, res) => { 
    res.render('pages/contacto', {
        title: 'Contacto'
    });
});

router.get('/newsletter/', (req, res) => { 
    res.render('pages/newsletter', {
        title: 'Newsletter'
    });
});

router.get('/error/', (req, res) => { 
    res.render('pages/error', {
        title: 'Error'
    });
});*/

module.exports = router;