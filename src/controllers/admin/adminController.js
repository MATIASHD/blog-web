const userRepository = require('../../repositories/user.repository');
const mediaService = require('../../services/media.service');
const postService = require('../../services/post.service');
const githubService = require('../../services/github.service');
const contactService = require('../../services/contact.service');
const newsletterService = require('../../services/newsletter.service');
const { validateEmail, validatePassword, isNonEmpty } = require('../../validators/common.validator');

const adminController = {
  dashboard: async (req, res) => {
    try {
      let posts;
      if (githubService.enabled) {
        const githubPostRepository = require('../../repositories/githubPost.repository');
        posts = await githubPostRepository.getAll();
      } else {
        posts = postService.getAllPosts();
      }
      const contacts = await contactService.getAllContacts();
      const subscribers = await newsletterService.getAllSubscribers();
      const stats = {
        totalPosts: posts.length,
        recentPosts: posts.slice(0, 5),
        totalContacts: contacts.length,
        unreadContacts: contacts.filter(c => c.status === 'pending').length,
        recentContacts: contacts.slice(0, 5),
        subscribers: subscribers.filter(s => s.status === 'active').length,
      };
      res.render('admin/dashboard', { title: 'Dashboard', stats });
    } catch (e) {
      res.render('admin/dashboard', { title: 'Dashboard', stats: null });
      return e;
    }
  },
  users: async (req, res) => {
    const users = await userRepository.getAll();
    res.render('admin/users', { title: 'Usuarios', users });
  },

  media: (req, res) => {
    const images = mediaService.getAll();
    res.render('admin/media', { title: 'Multimedia', images });
  },

  uploadMedia: (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
      }
      const result = mediaService.uploadFile(req.file);
      res.json({ success: true, file: result });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateMedia: (req, res) => {
    try {
      const { name, alt, newName } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Nombre de archivo requerido' });
      }
      const result = mediaService.updateFile(name, { alt, newName });
      res.json({ success: true, file: result });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteMedia: (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Nombre de archivo requerido' });
      }
      mediaService.deleteFile(name);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  posts: async (req, res) => {
    try {
      const posts = postService.getAllPosts();
      res.render('admin/posts', { title: 'Publicaciones', posts });
    } catch (e) {
      res.render('admin/posts', { title: 'Publicaciones', posts: [] });
      return e;
    }
  },

  settings: (req, res) => {
    res.render('admin/settings', { title: 'Configuración' });
  },

  newUser: (req, res) => {
    res.render('admin/newUser', { title: 'Crear Usuario', errors: null, user: null });
  },

  editUser: async (req, res) => {
    try {
      const user = await userRepository.getById(req.params.id);
      if (!user) {
        return res.status(404).render('admin/dashboard', { title: 'Dashboard', error: 'Usuario no encontrado' });
      }
      res.render('admin/newUser', { title: 'Editar Usuario', errors: null, user });
    } catch (e) {
      res.redirect('/dashboard/users');
      return e;
    }
  },

  createUser: async (req, res) => {
    const { name, email, password, role, is_active } = req.body;
    const errors = {};

    if (!isNonEmpty(name)) errors.name = 'El nombre es obligatorio';
    if (!isNonEmpty(email)) errors.email = 'El email es obligatorio';
    else if (!validateEmail(email).valid) errors.email = 'Formato de email inválido';
    if (!isNonEmpty(password)) errors.password = 'La contraseña es obligatoria';
    else if (!validatePassword(password).valid) errors.password = 'La contraseña debe tener al menos 6 caracteres';
    if (!isNonEmpty(role)) errors.role = 'Debe seleccionar un rol';

    if (Object.keys(errors).length > 0) {
      return res.render('admin/newUser', { title: 'Crear Usuario', errors, user: null });
    }

    try {
      const existing = await userRepository.getByEmail(email);
      if (existing) {
        errors.email = 'El email ya está registrado';
        return res.render('admin/newUser', { title: 'Crear Usuario', errors, user: null });
      }

      await userRepository.save({
        name,
        email,
        password,
        role,
        is_active: is_active === 'on' || is_active === true
      });
      res.redirect('/dashboard/users');
    } catch (error) {
      console.error('Error creating user:', error);
      errors.general = 'Error al crear el usuario. Intente nuevamente.';
      res.render('admin/newUser', { title: 'Crear Usuario', errors, user: null });
    }
  },

  updateUser: async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role, is_active } = req.body;
    const errors = {};

    if (!isNonEmpty(name)) errors.name = 'El nombre es obligatorio';
    if (!isNonEmpty(email)) errors.email = 'El email es obligatorio';
    else if (!validateEmail(email).valid) errors.email = 'Formato de email inválido';
    if (password && !validatePassword(password).valid) errors.password = 'La contraseña debe tener al menos 6 caracteres';
    if (!isNonEmpty(role)) errors.role = 'Debe seleccionar un rol';

    if (Object.keys(errors).length > 0) {
      const user = await userRepository.getById(id);
      return res.render('admin/newUser', { title: 'Editar Usuario', errors, user });
    }

    try {
      const updateData = {
        id,
        name,
        email,
        role,
        is_active: is_active === 'on' || is_active === true
      };
      if (password) {
        updateData.password = password;
      }

      await userRepository.save(updateData);
      res.redirect('/dashboard/users');
    } catch (error) {
      console.error('Error updating user:', error);
      errors.general = 'Error al actualizar el usuario.';
      const user = await userRepository.getById(id);
      res.render('admin/newUser', { title: 'Editar Usuario', errors, user });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      await userRepository.delete(id);
      res.redirect('/dashboard/users');
    } catch (error) {
      console.error('Error deleting user:', error);
      res.redirect('/dashboard/users');
    }
  },

  deleteUsersBatch: async (req, res) => {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'No se seleccionaron usuarios' });
      }
      for (const id of ids) {
        await userRepository.delete(id);
      }
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  contacts: async (req, res) => {
    try {
      const contacts = await contactService.getAllContacts();
      res.render('admin/contacts', { title: 'Contactos', contacts });
    } catch (e) {
      res.render('admin/contacts', { title: 'Contactos', contacts: [] });
      return e;
    }
  },

  contactDetail: async (req, res) => {
    try {
      const contact = await contactService.getContactById(req.params.id);
      if (!contact) {
        return res.redirect('/dashboard/contacts');
      }
      console.log(contact)
      res.render('admin/contactDetail', { title: 'Contacto', contact });
    } catch (e) {
      res.redirect('/dashboard/contacts');
      return e;
    }
  },

  contactReply: async (req, res) => {
    try {
      await contactService.updateContactStatus(req.params.id, 'replied');
      res.redirect('/dashboard/contacts');
    } catch (e) {
      res.redirect('/dashboard/contacts');
      return e;
    }
  },

  contactDelete: async (req, res) => {
    try {
      await contactService.deleteContact(req.params.id);
      res.redirect('/dashboard/contacts');
    } catch (e) {
      res.redirect('/dashboard/contacts');
      return e;
    }
  },

  subscribers: async (req, res) => {
    try {
      const subscribers = await newsletterService.getAllSubscribers();
      res.render('admin/subscribers', { title: 'Suscriptores', subscribers });
    } catch (e) {
      res.render('admin/subscribers', { title: 'Suscriptores', subscribers: [] });
      return e;
    }
  },

  subscriberDelete: async (req, res) => {
    try {
      const { email } = req.params;
      await newsletterService.unsubscribe(email);
      res.redirect('/dashboard/subscribers');
    } catch (e) {
      res.redirect('/dashboard/subscribers');
      return e;
    }
  },

  subscriberExport: async (req, res) => {
    try {
      const subscribers = await newsletterService.getAllSubscribers();
      const active = subscribers.filter(s => s.status === 'active');
      const csv = ['email,status,created_at']
        .concat(active.map(s => `${s.email},${s.status},${s.created_at}`))
        .join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
      res.send(csv);
    } catch (e) {
      res.redirect('/dashboard/subscribers');
      return e;
    }
  }
};

module.exports = adminController;
