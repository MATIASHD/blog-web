const express = require('express');
const router = express.Router();
const postsController = require('../../controllers/admin/posts.controller');

router.get('/', postsController.getAllPosts);
router.get('/new', postsController.getCreatePostForm);
router.post('/new', postsController.createPost);
router.get('/:slug/edit', postsController.getEditPostForm);
router.post('/:slug/edit', postsController.updatePost);
router.post('/:slug/delete', postsController.deletePost);

module.exports = router;
