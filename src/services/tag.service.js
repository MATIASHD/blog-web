const postService = require('./post.service');
const Logger = require('../utils/logger');

class TagService {
  getAll() {
    try {
      const posts = postService.getAllPosts();
      const tags = new Set();
      posts.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach(tag => tags.add(tag));
        }
      });
      const stats = this.getTagStats();
      return Array.from(tags)
        .sort()
        .map(tag => ({
          nombre: tag,
          slug: tag,
          count: stats[tag] || 0
        }));
    } catch (error) {
      Logger.error('Error getting tags', error);
      return [];
    }
  }

  getPostsByTag(tag) {
    try {
      return postService.getPostsByTag(tag);
    } catch (error) {
      Logger.error(`Error getting posts by tag: ${tag}`, error);
      return [];
    }
  }

  getTagStats() {
    try {
      const posts = postService.getAllPosts();
      const stats = {};

      posts.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach(tag => {
            stats[tag] = (stats[tag] || 0) + 1;
          });
        }
      });

      return stats;
    } catch (error) {
      Logger.error('Error getting tag stats', error);
      return {};
    }
  }

  getPopularTags(limit = 10) {
    try {
      const stats = this.getTagStats();
      return Object.entries(stats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([tag, count]) => ({ tag, count }));
    } catch (error) {
      Logger.error('Error getting popular tags', error);
      return [];
    }
  }
}

module.exports = new TagService();
