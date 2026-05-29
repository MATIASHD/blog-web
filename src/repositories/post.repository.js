const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { CONTENT_PATH } = require('../utils/constants');
const Logger = require('../utils/logger');

const contentPath = path.join(process.cwd(), CONTENT_PATH);

class PostRepository {
  getAll() {
    try {
      if (!fs.existsSync(contentPath)) {
        return [];
      }

      const files = fs.readdirSync(contentPath).filter(f => f.endsWith('.md'));
      return files.map(file => this.getBySlug(file.replace('.md', '')))
        .filter(post => post !== null)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      Logger.error('Error reading posts', error);
      return [];
    }
  }

  getBySlug(slug) {
    try {
      const filePath = path.join(contentPath, `${slug}.md`);
      if (!fs.existsSync(filePath)) {
        return null;
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const { data, content: markdown } = matter(content);

      return {
        ...data,
        slug,
        content: markdown,
      };
    } catch (error) {
      Logger.error(`Error reading post: ${slug}`, error);
      return null;
    }
  }

  save(slug, data) {
    try {
      const filePath = path.join(contentPath, `${slug}.md`);
      const frontmatter = Object.entries(data)
        .filter(([key]) => key !== 'content' && key !== 'htmlContent')
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}:\n${value.map(v => `  - ${v}`).join('\n')}`;
          }
          return `${key}: ${value}`;
        })
        .join('\n');

      const content = `---\n${frontmatter}\n---\n\n${data.content || ''}`;
      fs.writeFileSync(filePath, content, 'utf-8');
      return true;
    } catch (error) {
      Logger.error(`Error saving post: ${slug}`, error);
      return false;
    }
  }

  delete(slug) {
    try {
      const filePath = path.join(contentPath, `${slug}.md`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      Logger.error(`Error deleting post: ${slug}`, error);
      return false;
    }
  }

  exists(slug) {
    const filePath = path.join(contentPath, `${slug}.md`);
    return fs.existsSync(filePath);
  }
}

module.exports = new PostRepository();
