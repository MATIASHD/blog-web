const matter = require('gray-matter');
const githubService = require('../services/github.service');
const markdownService = require('../services/markdown.service');
const { slugify } = require('../utils/slugify');
const Logger = require('../utils/logger');

class GitHubPostRepository {
  async getAll() {
    try {
      const posts = await githubService.getAllPosts();
      return posts.map(post => ({
        ...post,
        content: post.content || ''
      }));
    } catch (error) {
      Logger.error('GitHubPostRepository.getAll error', error);
      return [];
    }
  }

  async getBySlug(slug) {
    try {
      const post = await githubService.getPostBySlug(slug);
      if (!post) return null;
      return {
        ...post,
        content: post.content || '',
        htmlContent: markdownService.parseMarkdown(post.content || '')
      };
    } catch (error) {
      Logger.error(`GitHubPostRepository.getBySlug error: ${slug}`, error);
      return null;
    }
  }

  async save(slug, data) {
    try {
      const isDraft = data.draft === true || data.draft === 'true';
      const folder = isDraft ? githubService.draftsPath : githubService.publishedPath;
      const filePath = `${folder}/${slug}.md`;

      const frontmatter = {};
      for (const [key, value] of Object.entries(data)) {
        if (key === 'content' || key === 'htmlContent' || key === 'id') continue;
        frontmatter[key] = value;
      }

      const content = this._buildFrontmatter(frontmatter) + (data.content || '');
      const commitMessage = data.sha ? `Update post: ${slug}` : `Create post: ${slug}`;

      const result = await githubService.saveFile(filePath, content, commitMessage);
      return { success: true, ...result };
    } catch (error) {
      Logger.error(`GitHubPostRepository.save error: ${slug}`, error);
      throw error;
    }
  }

  async delete(slug) {
    try {
      const post = await githubService.getPostBySlug(slug);
      if (!post) {
        throw new Error('Post not found on GitHub');
      }
      return await githubService.deleteFile(post.githubPath, `Delete post: ${slug}`);
    } catch (error) {
      Logger.error(`GitHubPostRepository.delete error: ${slug}`, error);
      throw error;
    }
  }

  async exists(slug) {
    try {
      const post = await githubService.getPostBySlug(slug);
      return post !== null;
    } catch (error) {
      return false;
    }
  }

  _buildFrontmatter(data) {
    let frontmatter = '---\n';
    for (const [key, value] of Object.entries(data)) {
      if (key === 'content' || key === 'htmlContent' || key === 'sha' || key === 'githubPath' || key === 'draft') continue;
      if (Array.isArray(value)) {
        frontmatter += `${key}:\n`;
        for (const item of value) {
          frontmatter += `  - ${item}\n`;
        }
      } else if (typeof value === 'boolean') {
        frontmatter += `${key}: ${value}\n`;
      } else if (value !== undefined && value !== null) {
        frontmatter += `${key}: ${value}\n`;
      }
    }
    frontmatter += '---\n\n';
    return frontmatter;
  }
}

module.exports = new GitHubPostRepository();
