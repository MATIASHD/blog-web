const isEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidPassword = (password) => {
  return password && password.length >= 6;
};

const isValidSlug = (slug) => {
  const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return regex.test(slug);
};

const isNonEmpty = (text) => {
  return text && text.trim().length > 0;
};

const validateEmail = (email) => {
  if (!email || !isEmail(email)) {
    return { valid: false, message: 'Invalid email format' };
  }
  return { valid: true };
};

const validatePassword = (password) => {
  if (!password || !isValidPassword(password)) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true };
};

const validateSlug = (slug) => {
  if (!slug || !isValidSlug(slug)) {
    return { valid: false, message: 'Invalid slug format' };
  }
  return { valid: true };
};

const validateText = (text, fieldName = 'Field') => {
  if (!text || !isNonEmpty(text)) {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true };
};

module.exports = {
  isEmail,
  isValidPassword,
  isValidSlug,
  isNonEmpty,
  validateEmail,
  validatePassword,
  validateSlug,
  validateText,
};
