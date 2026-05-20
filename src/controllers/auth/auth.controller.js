const authService = require('../../services/auth.service');
const { validateLogin, validateRegister } = require('../../validators/auth.validator');
const STATUS = require('../../constants/status');

const getLoginForm = (req, res, next) => {
  try {
    res.render('pages/login', {
      title: 'Login'
    });
  } catch (error) {
    next(error);
  }
};

const login = (req, res, next) => {
  try {
    const errors = validateLogin(req.body);
    if (errors) {
      return res.status(STATUS.BAD_REQUEST).render('pages/login', {
        title: 'Login',
        errors
      });
    }

    const user = authService.login(req.body.email, req.body.password);
    req.session.user = user;

    res.redirect('/admin');
  } catch (error) {
    res.status(STATUS.UNAUTHORIZED).render('pages/login', {
      title: 'Login',
      error: error.message
    });
  }
};

const getRegisterForm = (req, res, next) => {
  try {
    res.render('pages/register', {
      title: 'Register'
    });
  } catch (error) {
    next(error);
  }
};

const register = (req, res, next) => {
  try {
    const errors = validateRegister(req.body);
    if (errors) {
      return res.status(STATUS.BAD_REQUEST).render('pages/register', {
        title: 'Register',
        errors
      });
    }

    const user = authService.register(req.body);
    req.session.user = user;

    res.redirect('/');
  } catch (error) {
    res.status(STATUS.BAD_REQUEST).render('pages/register', {
      title: 'Register',
      error: error.message
    });
  }
};

const logout = (req, res, next) => {
  try {
    authService.logout(req.session.user?.id);
    req.session.destroy((err) => {
      if (err) next(err);
      res.redirect('/');
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLoginForm,
  login,
  getRegisterForm,
  register,
  logout
};