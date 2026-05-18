const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const posts = postservice.obtenerTodosLosPost();
    res.render('pages/index', {
        title: 'Home',
        posts
    });
});
 
module.exports = router;