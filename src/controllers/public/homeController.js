const postService = require('../../services/post.service');
const contactService = require('../../services/contact.service');
const newsletterService = require('../../services/newsletter.service');
const emailService = require('../../services/email.service');
const { validateContact } = require('../../validators/contact.validator');
const Logger = require('../../utils/logger');

const homeController = {
  index: async (req, res) => {
    try {
      const posts = await postService.getAllPostsAsync();
      res.render('pages/index', {
        title: 'Principal',
        posts
      });
    } catch (error) {
      Logger.error('Error loading index', error);
      res.render('pages/index', { title: 'Principal', posts: [] });
    }
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
  contactPost: async (req, res) => {
    try {
      const body = {
        name: req.body.nombre,
        email: req.body.email,
        subject: req.body.asunto,
        message: req.body.mensaje
      };
      const errors = validateContact(body);
      if (errors) {
        return res.render('pages/contact', {
          title: 'Contacto',
          error: Object.values(errors).join(', '),
          formData: body
        });
      }

      const contact = await contactService.createContact(body);

      emailService.sendContactNotification(contact);

      res.render('pages/contact', {
        title: 'Contacto',
        mensaje: 'Mensaje enviado correctamente. Gracias por contactarme.'
      });
    } catch (error) {
      Logger.error('Error processing contact form', error);
      res.render('pages/contact', {
        title: 'Contacto',
        error: 'Error al enviar el mensaje. Intente nuevamente.'
      });
    }
  },
  newsletter: (req, res) => {
    res.render('pages/newsletter', {
      title: 'Newsletter'
    });
  },
  newsletterPost: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !email.includes('@')) {
        return res.render('pages/newsletter', {
          title: 'Newsletter',
          error: 'Email inválido'
        });
      }

      const subscriber = await newsletterService.subscribe(email);

      if (subscriber && subscriber.confirm_token) {
        emailService.sendNewsletterConfirmation(email, subscriber.confirm_token);
      }

      res.render('pages/newsletter', {
        title: 'Newsletter',
        mensaje: '¡Suscripción exitosa! Gracias por unirte.'
      });
    } catch (error) {
      Logger.error('Error processing newsletter', error);
      res.render('pages/newsletter', {
        title: 'Newsletter',
        error: error.message === 'Email already subscribed'
          ? 'Este email ya está suscrito.'
          : 'Error al suscribir. Intente nuevamente.'
      });
    }
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
