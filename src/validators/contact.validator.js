const { validateEmail, isNonEmpty } = require('./common.validator');

const validateContact = (data) => {
  const errors = {};

  if (!data.name || !isNonEmpty(data.name)) {
    errors.name = 'Name is required';
  }

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.valid) {
    errors.email = emailValidation.message;
  }

  if (!data.subject || !isNonEmpty(data.subject)) {
    errors.subject = 'Subject is required';
  }

  if (!data.message || !isNonEmpty(data.message)) {
    errors.message = 'Message is required';
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

module.exports = {
  validateContact,
};
