const adminController = require('./admin/admin.controller');
const authController = require('./auth/auth.controller');
const publicController = require('./public/public.controller');
const seoController = require('./seo/seo.controller');
const systemController = require('./system/system.controller');

module.exports = {
  admin: adminController,
  auth: authController,
  public: publicController,
  seo: seoController,
  system: systemController
}