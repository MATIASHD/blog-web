const express = require('express');
const router = express.Router();

router.use('/', require('./about.router'));
router.use('/', require('./blog.router'));
router.use('/', require('./category.router'));
router.use('/', require('./contact.router'));
router.use('/', require('./home.router'));
router.use('/', require('./search.router'));
router.use('/', require('./tag.router'));
router.use('/', require('./blogList.router'));
router.use('/', require('./blogPagination.router'));
router.use('/', require('./error.router'));
router.use('/', require('./newsletter.router'));
router.use('/', require('./tags.router'));

module.exports = router;
