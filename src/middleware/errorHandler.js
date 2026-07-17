const ApiError = require('../utils/apiError');
const Logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  Logger.error('Error occurred', err);

  if (req.accepts('html')) {
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    return res.status(statusCode).render('pages/error', {
      title: 'Error',
      error: err.message || 'Error interno del servidor',
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
};

module.exports = errorHandler;
