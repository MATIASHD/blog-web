const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const postService = require('../services/post.service');
const localeMiddleware = require('../middleware/locale.middleware');
const { DEFAULT_LANG } = require('../config/i18n');

const renderLocalePage = (res, view, data = {}) => {
  res.render(view, {
    lang: res.locals.lang,
    langPrefix: res.locals.langPrefix,
    otherLang: res.locals.otherLang,
    otherLangPrefix: res.locals.otherLangPrefix,
    ...data,
  });
};

router.get('/', (req, res) => {
  res.redirect(302, `/${DEFAULT_LANG}`);
});

router.use('/:lang', localeMiddleware);

router.get('/:lang', (req, res) => {
  const lang = res.locals.lang;
  const posts = postService.obtenerTodosLosPost({ lang });

  renderLocalePage(res, 'pages/index', {
    title: lang === 'es' ? 'Inicio' : 'Home',
    posts,
  });
});

router.get('/:lang/blog/:slug', (req, res) => {
  try {
    const post = postService.obtenerPost(req.params.slug, res.locals.lang);
    const translation = postService.obtenerTraduccion(post);

    renderLocalePage(res, 'pages/article', {
      title: post.seoTitle || post.title,
      post,
      translation,
    });
  } catch (error) {
    console.error(error.message);
    res.status(404);
    renderLocalePage(res, 'pages/404', {
      title: res.locals.lang === 'es' ? 'Artículo no encontrado' : 'Post not found',
    });
  }
});

router.get('/:lang/blog', (req, res) => {
  const lang = res.locals.lang;
  const posts = postService.obtenerTodosLosPost({ lang });
  const todasLasCategorias = postService.obtenerCategorias(lang);
  const todosLosTags = postService.obtenerTags(lang);

  renderLocalePage(res, 'pages/blog', {
    title: 'Blog',
    posts,
    todasLasCategorias,
    todosLosTags,
    paginaActual: 1,
    totalPaginas: 1,
  });
});

router.get('/:lang/categoria/:slug', (req, res) => {
  const lang = res.locals.lang;
  const posts = postService.obtenerTodosLosPost({
    lang,
    category: req.params.slug,
  });
  const todasLasCategorias = postService.obtenerCategorias(lang);
  const todosLosTags = postService.obtenerTags(lang);
  const categoria =
    todasLasCategorias.find((cat) => cat.slug === req.params.slug)?.nombre ||
    req.params.slug;

  renderLocalePage(res, 'pages/categoria', {
    title: `Categoría: ${categoria}`,
    categoria,
    categoriaSlug: req.params.slug,
    posts,
    todasLasCategorias,
    todosLosTags,
    paginaActual: 1,
    totalPaginas: 1,
  });
});

router.get('/:lang/tags/:slug', (req, res) => {
  const lang = res.locals.lang;
  const posts = postService.obtenerTodosLosPost({
    lang,
    tag: req.params.slug,
  });
  const todasLasCategorias = postService.obtenerCategorias(lang);
  const todosLosTags = postService.obtenerTags(lang);
  const tag =
    todosLosTags.find((item) => item.slug === req.params.slug)?.nombre ||
    req.params.slug;

  renderLocalePage(res, 'pages/tags', {
    title: `Tag: ${tag}`,
    tag,
    tagSlug: req.params.slug,
    posts,
    todasLasCategorias,
    todosLosTags,
    paginaActual: 1,
    totalPaginas: 1,
  });
});

router.get('/:lang/search', (req, res) => {
  const lang = res.locals.lang;
  const query = req.query.q || '';
  const posts = postService.obtenerTodosLosPost({ lang, q: query });
  const todasLasCategorias = postService.obtenerCategorias(lang);
  const todosLosTags = postService.obtenerTags(lang);

  renderLocalePage(res, 'pages/search', {
    title: lang === 'es' ? 'Búsqueda' : 'Search',
    query,
    posts,
    todasLasCategorias,
    todosLosTags,
    paginaActual: 1,
    totalPaginas: 1,
  });
});

router.get('/blog/:slug', (req, res) => {
  res.redirect(301, `/${DEFAULT_LANG}/blog/${req.params.slug}`);
});

router.get('/blog', (req, res) => {
  res.redirect(301, `/${DEFAULT_LANG}/blog`);
});

router.get('/about', (req, res) => {
  res.render('pages/about', { title: 'About' });
});

router.get('/login', (req, res) => {
  res.render('pages/login', { title: 'login' });
});

router.get('/dashboard', (req, res) => {
  res.render('pages/dashboard', { title: 'dashboard' });
});

router.get('/categoria/:slug', (req, res) => {
  res.redirect(301, `/${DEFAULT_LANG}/categoria/${req.params.slug}`);
});

router.get('/tags/:slug', (req, res) => {
  res.redirect(301, `/${DEFAULT_LANG}/tags/${req.params.slug}`);
});

router.get('/search', (req, res) => {
  const query = req.query.q ? `?q=${encodeURIComponent(req.query.q)}` : '';
  res.redirect(301, `/${DEFAULT_LANG}/search${query}`);
});

router.get('/contacto', (req, res) => {
  res.render('pages/contacto', { title: 'Contacto' });
});

router.get('/newsletter', (req, res) => {
  res.render('pages/newsletter', { title: 'Newsletter' });
});

router.get('/error', (req, res) => {
  res.render('pages/error', { title: 'Error' });
});
=======

router.use('/', require('./public'));
router.use('/', require('./auth'));
router.use('/admin', require('./admin'));
router.use('/', require('./seo'));
router.use('/', require('./system'));

>>>>>>> 6ad1e2580b63a3f18777c8a7a79bea31c9b7f466

module.exports = router;
