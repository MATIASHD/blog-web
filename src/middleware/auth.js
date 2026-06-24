const ApiError = require('../utils/apiError');
const STATUS = require('../constants/status');
const { ROLES } = require('../constants/roles');
const bcryptjs = require('bcryptjs');

const requireAuth = (req, res, next) => {
  if (!req.session?.user) {
    if (req.accepts('html')) {
      return res.redirect('/login');
    }
    throw new ApiError('Unauthorized', STATUS.UNAUTHORIZED);
  }
  next();
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.session?.user) {
      throw new ApiError('Unauthorized', STATUS.UNAUTHORIZED);
    }
    if (!allowedRoles.includes(req.session.user.role)) {
      throw new ApiError('Forbidden', STATUS.FORBIDDEN);
    }
    next();
  };
};

const requireAdmin = (req, res, next) => {
  if (!req.session?.user || req.session.user.role !== ROLES.ADMIN) {
    if (req.accepts('html')) {
      return res.redirect('/login');
    }
    throw new ApiError('Admin access required', STATUS.FORBIDDEN);
  }
  next();
};

const registerUser = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = bcryptjs.hashSync(req.body.password, 10);
  // Aquí deberías guardar el usuario en tu base de datos
  // Por ejemplo:
  // await User.create({ name, email, password });
}
module.exports = { requireAuth, requireRole, requireAdmin, registerUser };
