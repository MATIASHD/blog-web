const ApiResponse = require('../../utils/response');

const getSettings = (req, res, next) => {
  try {
    const settings = {
      siteTitle: 'My Blog',
      siteDescription: 'A professional blog',
      siteUrl: 'https://example.com',
      postsPerPage: 10,
      enableComments: false,
      enableNewsletter: true,
      theme: 'light'
    };

    res.render('pages/settings', {
      title: 'Settings',
      settings
    });
  } catch (error) {
    next(error);
  }
};

const updateSettings = (req, res, next) => {
  try {
    const { siteTitle, siteDescription, postsPerPage, enableComments, enableNewsletter, theme } = req.body;

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        siteTitle,
        siteDescription,
        postsPerPage,
        enableComments,
        enableNewsletter,
        theme
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings
};
