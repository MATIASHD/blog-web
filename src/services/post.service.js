const postRepository = require('../repositories/post.repository');
const markdownService = require('./markdown.service');
const { slugify } = require('../utils/slugify');
const Logger = require('../utils/logger');

class PostService {
  getAllPosts() {
    try {
      const posts = postRepository.getAll();
      return posts.map(post => this.formatPost(post));
    } catch (error) {
      Logger.error('Error getting all posts', error);
      return [];
    }
  }

  getPostBySlug(slug) {
    try {
      const post = postRepository.getBySlug(slug);
      if (!post) return null;

      return {
        ...this.formatPost(post),
        htmlContent: markdownService.parseMarkdown(post.content)
      };
    } catch (error) {
      Logger.error(`Error getting post: ${slug}`, error);
      return null;
    }
  }

  getPostsByTag(tag) {
    try {
      const posts = this.getAllPosts();
      return posts.filter(post => post.tags && post.tags.includes(tag));
    } catch (error) {
      Logger.error(`Error getting posts by tag: ${tag}`, error);
      return [];
    }
  }

  getPostsByCategory(category) {
    try {
      const posts = this.getAllPosts();
      return posts.filter(post => post.category === category);
    } catch (error) {
      Logger.error(`Error getting posts by category: ${category}`, error);
      return [];
    }
  }

  searchPosts(query) {
    try {
      if (!query || query.trim().length === 0) {
        return [];
      }

      const lowerQuery = query.toLowerCase();
      const posts = this.getAllPosts();

      return posts.filter(post => {
        return (
          post.title?.toLowerCase().includes(lowerQuery) ||
          post.description?.toLowerCase().includes(lowerQuery) ||
          post.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
      });
    } catch (error) {
      Logger.error('Error searching posts', error);
      return [];
    }
  }

  createPost(postData) {
    try {
      const slug = slugify(postData.slug || postData.title);

      if (postRepository.exists(slug)) {
        throw new Error('Post with this slug already exists');
      }

      const post = {
        title: postData.title,
        author: postData.author,
        description: postData.description,
        image: postData.image || '',
        date: postData.date || new Date().toISOString(),
        tags: postData.tags || [],
        category: postData.category || '',
        slug: slug
      };

      postRepository.save(slug, {
        ...post,
        content: postData.content
      });

      return post;
    } catch (error) {
      Logger.error('Error creating post', error);
      throw error;
    }
  }

  updatePost(slug, postData) {
    try {
      const post = postRepository.getBySlug(slug);
      if (!post) {
        throw new Error('Post not found');
      }

      const updated = {
        ...post,
        title: postData.title || post.title,
        author: postData.author || post.author,
        description: postData.description || post.description,
        image: postData.image || post.image,
        tags: postData.tags || post.tags,
        category: postData.category || post.category,
        date: postData.date || post.date
      };

      postRepository.save(slug, updated);
      return this.formatPost(updated);
    } catch (error) {
      Logger.error(`Error updating post: ${slug}`, error);
      throw error;
    }
  }

  deletePost(slug) {
    try {
      const deleted = postRepository.delete(slug);
      if (!deleted) {
        throw new Error('Post not found');
      }
      return true;
    } catch (error) {
      Logger.error(`Error deleting post: ${slug}`, error);
      throw error;
    }
  }

  formatPost(post) {
    return {
      title: post.title,
      slug: post.slug,
      author: post.author,
      description: post.description,
      image: post.image,
      date: post.date,
      tags: post.tags || [],
      category: post.category || ''
    };
  }
}

module.exports = new PostService();
