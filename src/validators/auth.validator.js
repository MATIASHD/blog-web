const { validateEmail, validatePassword, isNonEmpty } = require('./common.validator');

const validateLogin = (data) => {
  const errors = {};

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.valid) {
    errors.email = emailValidation.message;
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.message;
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

const validateRegister = (data) => {
  const errors = {};

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.valid) {
    errors.email = emailValidation.message;
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.message;
  }

  if (!data.confirmPassword || data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!data.name || !isNonEmpty(data.name)) {
    errors.name = 'Name is required';
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

module.exports = {
  validateLogin,
  validateRegister,
};
