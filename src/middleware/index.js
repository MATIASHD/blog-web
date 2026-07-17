const errorHandler = require('./errorHandler');
const { validateRequest } = require('./validation');
const { requireAuth, requireRole, requireAdmin } = require('./auth');
const authenticate = require('./authenticate');

module.exports = {
  errorHandler,
  validateRequest,
  requireAuth,
  requireRole,
  requireAdmin,
  authenticate,
};
