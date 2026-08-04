const ApiError = require('../utils/apiError');
const STATUS = require('../constants/status');

const validateRequest = (...validators) => {
  return (req, res, next) => {
    try {
      const errors = {};
      for (const validator of validators) {
        const result = validator(req.body);
        if (result && typeof result === 'object') {
          Object.assign(errors, result);
        }
      }
      if (Object.keys(errors).length > 0) {
        throw new ApiError('Validation failed', STATUS.BAD_REQUEST, errors);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { validateRequest };
