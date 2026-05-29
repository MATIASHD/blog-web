const express = require('express');
const router = express.Router();
const { editPostController } = require('../../controllers/admin/editpost.controller');

router.get('/admin/posts/:id/edit', editPostController);

module.exports = router;