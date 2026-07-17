const postService = require('../../services/post.service');

const homeController = {
    index: (req, res) => {
        const posts = postService.getAllPosts();
        res.render('pages/index', {
            title: 'Principal',
            posts
        });
    },
    about: (req, res) => {
        res.render('pages/about', {
            title: 'Sobre mí'
        });
    },
    contact: (req, res) => {
        res.render('pages/contact', {
            title: 'Contacto'
        });
    },
    newsletter: (req, res) => {
        res.render('pages/newsletter', {
            title: 'Newsletter'
        });
    },
    login: (req, res) => {
        res.render('pages/login', {
            title: 'Login'
        });
    },
    passwordReset: (req, res) => {
        res.render('pages/passwordReset', {
            title: 'Restablecer contraseña'
        });
    }
};
module.exports = homeController;
