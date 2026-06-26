const userRepository = require('../../repositories/user.repository');
const { validateEmail, validatePassword, isNonEmpty } = require('../../validators/common.validator');

const adminController = {
    dashboard: (req, res) => {
        res.render('admin/dashboard', { title: 'Dashboard' });
    },
    users: async (req, res) => {
        const users = await userRepository.getAll();
        res.render('admin/users', { title: 'Usuarios', users });
    },
    media: (req, res) => {
        res.render('admin/media', { title: 'Média' });
    },
    posts: (req, res) => {
        res.render('admin/posts', { title: 'Publicaciones' });
    },
    settings: (req, res) => {
        res.render('admin/settings', { title: 'Configuración' });
    },
    newUser: (req, res) => {
        res.render('admin/newUser', { title: 'Crear Usuario', errors: null });
    },
    createUser: async (req, res) => {
        const { name, email, password, role } = req.body;
        const errors = {};

        if (!isNonEmpty(name)) errors.name = 'El nombre es obligatorio';
        if (!isNonEmpty(email)) errors.email = 'El email es obligatorio';
        else if (!validateEmail(email).valid) errors.email = 'Formato de email inválido';
        if (!isNonEmpty(password)) errors.password = 'La contraseña es obligatoria';
        else if (!validatePassword(password).valid) errors.password = 'La contraseña debe tener al menos 6 caracteres';
        if (!isNonEmpty(role)) errors.role = 'Debe seleccionar un rol';

        if (Object.keys(errors).length > 0) {
            return res.render('admin/newUser', { title: 'Crear Usuario', errors });
        }

        try {
            const existing = await userRepository.getByEmail(email);
            if (existing) {
                errors.email = 'El email ya está registrado';
                return res.render('admin/newUser', { title: 'Crear Usuario', errors });
            }

            await userRepository.save({ name, email, password, role });
            res.redirect('/dashboard/users');
        } catch (error) {
            console.error('Error creating user:', error);
            errors.general = 'Error al crear el usuario. Intente nuevamente.';
            res.render('admin/newUser', { title: 'Crear Usuario', errors });
        }
    }
};

module.exports = adminController;
