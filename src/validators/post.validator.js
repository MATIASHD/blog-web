const { validateText, validateEmail, isNonEmpty } = require('./common.validator');

const validatePostCreate = (data) => {
  const errors = {};

  if (!data.title || !isNonEmpty(data.title)) {
    errors.title = 'Title is required';
  }

  if (!data.slug || !isNonEmpty(data.slug)) {
    errors.slug = 'Slug is required';
  }

  if (!data.content || !isNonEmpty(data.content)) {
    errors.content = 'Content is required';
  }

  if (!data.author || !isNonEmpty(data.author)) {
    errors.author = 'Author is required';
  }

  if (!data.description || !isNonEmpty(data.description)) {
    errors.description = 'Description is required';
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

const validatePostUpdate = (data) => {
  return validatePostCreate(data);
};

module.exports = {
  validatePostCreate,
  validatePostUpdate,
};
