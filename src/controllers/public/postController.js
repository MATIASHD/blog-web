const postService = require('../../services/post.service');
const githubService = require('../../services/github.service');

const postController = {
  post: async (req, res) => {
    try {
      let post;
      if (githubService.enabled) {
        const githubPostRepository = require('../../repositories/githubPost.repository');
        post = await githubPostRepository.getBySlug(req.params.slug);
      } else {
        post = postService.getPostBySlug(req.params.slug);
      }

      if (!post) {
        return res.status(404).render('pages/404', { title: 'Post Not Found' });
      }
      res.render('pages/article', {
        title: post.title,
        post
      });
    } catch (error) {
      res.status(404).render('pages/404', { title: 'Post Not Found' });
    }
  }
};
module.exports = postController;
