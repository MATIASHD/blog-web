const postService = require('../../services/post.service');
const { validatePostCreate } = require('../../validators/post.validator');
const ApiResponse = require('../../utils/response');
const STATUS = require('../../constants/status');
const MESSAGES = require('../../constants/messages');

const getAllPosts = (req, res, next) => {
  try {
    const posts = postService.getAllPosts();
    res.render('pages/posts', {
      title: 'Manage Posts',
      posts
    });
  } catch (error) {
    next(error);
  }
};

const getCreatePostForm = (req, res, next) => {
  try {
    res.render('pages/new-post', {
      title: 'Create New Post'
    });
  } catch (error) {
    next(error);
  }
};

const createPost = (req, res, next) => {
  try {
    const errors = validatePostCreate(req.body);
    if (errors) {
      return res.status(STATUS.BAD_REQUEST).render('pages/new-post', {
        title: 'Create New Post',
        errors,
        ...req.body
      });
    }

    const post = postService.createPost(req.body);
    res.redirect('/admin/posts');
  } catch (error) {
    res.status(STATUS.BAD_REQUEST).render('pages/new-post', {
      title: 'Create New Post',
      error: error.message
    });
  }
};

const getEditPostForm = (req, res, next) => {
  try {
    const post = postService.getPostBySlug(req.params.slug);
    if (!post) {
      return res.status(STATUS.NOT_FOUND).render('pages/404', {
        title: 'Post Not Found'
      });
    }

    res.render('pages/edit-post', {
      title: `Edit: ${post.title}`,
      post
    });
  } catch (error) {
    next(error);
  }
};

const updatePost = (req, res, next) => {
  try {
    const errors = validatePostCreate(req.body);
    if (errors) {
      return res.status(STATUS.BAD_REQUEST).render('pages/edit-post', {
        title: 'Edit Post',
        errors,
        post: req.body
      });
    }

    postService.updatePost(req.params.slug, req.body);
    res.redirect('/admin/posts');
  } catch (error) {
    res.status(STATUS.BAD_REQUEST).render('pages/edit-post', {
      title: 'Edit Post',
      error: error.message
    });
  }
};

const deletePost = (req, res, next) => {
  try {
    postService.deletePost(req.params.slug);
    res.redirect('/admin/posts');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPosts,
  getCreatePostForm,
  createPost,
  getEditPostForm,
  updatePost,
  deletePost
};
