const { isSupportedLang, DEFAULT_LANG } = require('../config/i18n');

const localeMiddleware = (req, res, next) => {
  const lang = req.params.lang;

  if (!isSupportedLang(lang)) {
    return next('route');
  }

  res.locals.lang = lang;
  res.locals.langPrefix = `/${lang}`;
  res.locals.defaultLang = DEFAULT_LANG;
  res.locals.otherLang = lang === 'es' ? 'en' : 'es';
  res.locals.otherLangPrefix = lang === 'es' ? '/en' : '/es';

  next();
};

module.exports = localeMiddleware;
