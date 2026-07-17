const ApiError = require('../utils/apiError');
const STATUS = require('../constants/status');
const { ROLES } = require('../constants/roles');

const requireAuth = (req, res, next) => {
  if (!req.user) {
    if (req.accepts('html')) {
      return res.redirect('/login');
    }
    throw new ApiError('Unauthorized', STATUS.UNAUTHORIZED);
  }
  next();
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError('Unauthorized', STATUS.UNAUTHORIZED);
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError('Forbidden', STATUS.FORBIDDEN);
    }
    next();
  };
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== ROLES.ADMIN) {
    if (req.accepts('html')) {
      return res.redirect('/login');
    }
    throw new ApiError('Admin access required', STATUS.FORBIDDEN);
  }
  next();
};

module.exports = { requireAuth, requireRole, requireAdmin };
