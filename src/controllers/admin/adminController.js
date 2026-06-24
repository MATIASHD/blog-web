const adminController = {
    dashboard: (req, res) => {
        res.render('admin/dashboard', {
            title: 'Dashboard'
        });
    },
    users: (req, res) => {
        res.render('admin/users', {
            title: 'Usuarios'
        });
    },
    media: (req, res) => {
        res.render('admin/media', {
            title: 'Média'
        });
    },
    posts: (req, res) => {
        res.render('admin/posts', {
            title: 'Publicaciones'
        });
    },
    settings: (req, res) => {
        res.render('admin/settings', {
            title: 'Configuración'
        });
    }
};

module.exports = adminController;