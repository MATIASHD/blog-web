const SUPPORTED_LANGS = ['es', 'en'];
const DEFAULT_LANG = 'es';

const isSupportedLang = (lang) => SUPPORTED_LANGS.includes(lang);

module.exports = {
  SUPPORTED_LANGS,
  DEFAULT_LANG,
  isSupportedLang,
};
