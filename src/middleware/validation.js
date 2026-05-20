const ApiError = require('../utils/apiError');
const STATUS = require('../constants/status');

const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        const errors = {};
        error.details.forEach((detail) => {
          errors[detail.path[0]] = detail.message;
        });
        throw new ApiError('Validation failed', STATUS.BAD_REQUEST, errors);
      }
      req.body = value;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { validateRequest };
