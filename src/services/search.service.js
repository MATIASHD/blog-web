const postService = require('./post.service');
const Logger = require('../utils/logger');

class SearchService {
  search(query, filters = {}) {
    try {
      let results = postService.searchPosts(query);

      if (filters.tag) {
        results = results.filter(post =>
          post.tags && post.tags.includes(filters.tag)
        );
      }

      if (filters.category) {
        results = results.filter(post => post.category === filters.category);
      }

      if (filters.author) {
        results = results.filter(post =>
          post.author?.toLowerCase().includes(filters.author.toLowerCase())
        );
      }

      if (filters.sortBy === 'date') {
        results.sort((a, b) => new Date(b.date) - new Date(a.date));
      }

      if (filters.sortBy === 'title') {
        results.sort((a, b) => a.title.localeCompare(b.title));
      }

      return results;
    } catch (error) {
      Logger.error('Search error', error);
      return [];
    }
  }

  getAllCategories() {
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

  getAllTags() {
    try {
      const posts = postService.getAllPosts();
      const tags = new Set();
      posts.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach(tag => tags.add(tag));
        }
      });
      return Array.from(tags).sort();
    } catch (error) {
      Logger.error('Error getting tags', error);
      return [];
    }
  }
}

module.exports = new SearchService();
