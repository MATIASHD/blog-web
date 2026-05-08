const express = require('express');
const router = express.Router();

router.get ('/', (req, res) => {
    res.render('index', { title: 'Home' });
});
router.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});
router.get('/blog/:slug', (req, res) => {
    res.render('blog', { title: 'Blog' });
});

module.exports = router;