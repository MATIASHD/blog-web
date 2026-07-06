const githubService = require('../../services/github.service');
const githubPostRepository = require('../../repositories/githubPost.repository');
const postService = require('../../services/post.service');
const markdownService = require('../../services/markdown.service');
const { slugify } = require('../../utils/slugify');
const Logger = require('../../utils/logger');

const postsController = {
  getAllPosts: async (req, res) => {
    try {
      let posts;
      if (githubService.enabled) {
        posts = await githubPostRepository.getAll();
      } else {
        posts = postService.getAllPosts();
      }
      res.render('admin/posts', { title: 'Publicaciones', posts });
    } catch (error) {
      Logger.error('Error getting posts', error);
      res.render('admin/posts', { title: 'Publicaciones', posts: [] });
    }
  },

  getCreatePostForm: (req, res) => {
    res.render('admin/dashboardNewpost', { title: 'Nuevo Post', error: null, post: null });
  },

  createPost: async (req, res) => {
    try {
      const { title, author, description, image, category, tags, content, draft } = req.body;

      if (!title || !content) {
        return res.render('admin/dashboardNewpost', {
          title: 'Nuevo Post',
          error: 'Título y contenido son obligatorios',
          post: { title, author, description, image, category, tags, content, draft }
        });
      }

      const slug = slugify(title);

      if (githubService.enabled) {
        const postData = {
          title,
          author: author || '',
          description: description || '',
          image: image || '',
          category: category || '',
          tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
          date: new Date().toISOString().split('T')[0],
          draft: draft === 'on' || draft === 'true' || draft === true,
          content
        };
        await githubPostRepository.save(slug, postData);
      } else {
        postService.createPost({
          title,
          author,
          description,
          image,
          category,
          tags,
          content,
          slug
        });
      }

      res.redirect('/dashboard/posts');
    } catch (error) {
      Logger.error('Error creating post', error);
      res.render('admin/dashboardNewpost', {
        title: 'Nuevo Post',
        error: error.message,
        post: req.body
      });
    }
  },

  getEditPostForm: async (req, res) => {
    try {
      const { slug } = req.params;
      let post;

      if (githubService.enabled) {
        post = await githubPostRepository.getBySlug(slug);
      } else {
        const raw = postService.getPostBySlug(slug);
        post = raw ? {
          title: raw.title,
          slug: raw.slug,
          author: raw.author,
          description: raw.description,
          image: raw.image,
          category: raw.category,
          tags: Array.isArray(raw.tags) ? raw.tags.join(', ') : raw.tags,
          content: raw.content,
          draft: raw.draft || false
        } : null;
      }

      if (!post) {
        return res.status(404).render('admin/posts', {
          title: 'Publicaciones',
          posts: githubService.enabled ? await githubPostRepository.getAll() : postService.getAllPosts(),
          error: 'Post no encontrado'
        });
      }

      res.render('admin/editPost', { title: `Editar: ${post.title}`, post, error: null });
    } catch (error) {
      Logger.error('Error getting edit form', error);
      res.redirect('/dashboard/posts');
    }
  },

  updatePost: async (req, res) => {
    try {
      const { slug } = req.params;
      const { title, author, description, image, category, tags, content, draft } = req.body;

      if (!title || !content) {
        let post;
        if (githubService.enabled) {
          post = await githubPostRepository.getBySlug(slug);
        } else {
          post = postService.getPostBySlug(slug);
        }
        return res.render('admin/editPost', {
          title: `Editar: ${title}`,
          post: { ...req.body, slug },
          error: 'Título y contenido son obligatorios'
        });
      }

      if (githubService.enabled) {
        const postData = {
          title,
          author: author || '',
          description: description || '',
          image: image || '',
          category: category || '',
          tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
          date: new Date().toISOString().split('T')[0],
          draft: draft === 'on' || draft === 'true' || draft === true,
          content
        };
        await githubPostRepository.save(slug, postData);
      } else {
        postService.updatePost(slug, {
          title,
          author,
          description,
          image,
          category,
          tags,
          content
        });
      }

      res.redirect('/dashboard/posts');
    } catch (error) {
      Logger.error('Error updating post', error);
      res.render('admin/editPost', {
        title: 'Error al editar',
        post: req.body,
        error: error.message
      });
    }
  },

  deletePost: async (req, res) => {
    try {
      const { slug } = req.params;

      if (githubService.enabled) {
        await githubPostRepository.delete(slug);
      } else {
        postService.deletePost(slug);
      }

      res.redirect('/dashboard/posts');
    } catch (error) {
      Logger.error('Error deleting post', error);
      res.redirect('/dashboard/posts');
    }
  }
};

module.exports = postsController;
