const postService = require('./post.service');
const Logger = require('../utils/logger');

class CategoryService {
  getAll() {
    try {
      const posts = postService.getAllPosts();
      const categories = new Set(posts
        .filter(p => p.category)
        .map(p => p.category)
      );
      return Array.from(categories).sort();
    } catch (error) {
      Logger.error('Error getting categories', error);
      return [];
    }
  }

  getPostsByCategory(category) {
    try {
      return postService.getPostsByCategory(category);
    } catch (error) {
      Logger.error(`Error getting posts by category: ${category}`, error);
      return [];
    }
  }

  getCategoryStats() {
    try {
      const posts = postService.getAllPosts();
      const stats = {};

      posts.forEach(post => {
        if (post.category) {
          stats[post.category] = (stats[post.category] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      Logger.error('Error getting category stats', error);
      return {};
    }
  }
}

module.exports = new CategoryService();
