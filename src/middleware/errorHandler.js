const ApiError = require('../utils/apiError');
const Logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  Logger.error('Error occurred', err);

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
