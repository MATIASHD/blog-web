const express = require('express');
const router = express.Router();
const postsController = require('../../controllers/admin/posts.controller');

router.get('/posts', postsController.getAllPosts);
router.get('/posts/new', postsController.getCreatePostForm);
router.post('/posts', postsController.createPost);
router.get('/posts/:slug/edit', postsController.getEditPostForm);
router.post('/posts/:slug', postsController.updatePost);
router.post('/posts/:slug/delete', postsController.deletePost);

module.exports = router;
