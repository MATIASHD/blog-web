const express = require('express');
const router = express.Router();

router.use('/', require('./about.router'));
router.use('/', require('./blog.router'));
router.use('/', require('./category.router'));
router.use('/', require('./contact.router'));
router.use('/', require('./home.router'));
router.use('/', require('./search.router'));
router.use('/', require('./tag.router'));

module.exports = router;
