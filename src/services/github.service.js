const https = require('https');
const Logger = require('../utils/logger');

class GithubService {
  constructor() {
    this.token = process.env.GITHUB_TOKEN || '';
    this.owner = process.env.GITHUB_REPO_OWNER || '';
    this.repo = process.env.GITHUB_REPO_NAME || '';
    this.branch = process.env.GITHUB_BRANCH || 'main';
    this.publishedPath = process.env.GITHUB_PUBLISHED_PATH || 'publicaciones';
    this.draftsPath = process.env.GITHUB_DRAFTS_PATH || 'borradores';
    this._enabled = !!(this.token && this.owner && this.repo);
  }

  get enabled() {
    return this._enabled;
  }

  _apiRequest(method, path, body = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.github.com',
        path: `/repos/${this.owner}/${this.repo}/contents/${path}`,
        method,
        headers: {
          'User-Agent': 'blog-dashboard',
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${this.token}`
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode >= 400) {
              reject(new Error(parsed.message || `GitHub API error: ${res.statusCode}`));
            } else {
              resolve(parsed);
            }
          } catch (e) {
            resolve(data);
          }
        });
      });

      req.on('error', reject);

      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  }

  async listFiles(dirPath = '') {
    try {
      const result = await this._apiRequest('GET', dirPath);
      if (!Array.isArray(result)) {
        return [];
      }
      return result.filter(item => item.type === 'file' && item.name.endsWith('.md'));
    } catch (error) {
      Logger.error(`GitHub listFiles error: ${dirPath}`, error);
      return [];
    }
  }

  async getFileContent(filePath) {
    try {
      const result = await this._apiRequest('GET', filePath);
      if (!result || !result.content) return null;
      const content = Buffer.from(result.content, 'base64').toString('utf-8');
      return {
        content,
        sha: result.sha,
        path: result.path,
        name: result.name,
        download_url: result.download_url
      };
    } catch (error) {
      Logger.error(`GitHub getFileContent error: ${filePath}`, error);
      return null;
    }
  }

  async saveFile(filePath, content, message = 'Update post via dashboard') {
    try {
      let sha = null;
      try {
        const existing = await this._apiRequest('GET', filePath);
        if (existing && existing.sha) {
          sha = existing.sha;
        }
      } catch (e) {}

      const body = {
        message,
        content: Buffer.from(content, 'utf-8').toString('base64'),
        branch: this.branch
      };

      if (sha) {
        body.sha = sha;
      }

      const result = await this._apiRequest('PUT', filePath, body);
      return { success: true, path: filePath, sha: result && result.content ? result.content.sha : null };
    } catch (error) {
      Logger.error(`GitHub saveFile error: ${filePath}`, error);
      throw error;
    }
  }

  async deleteFile(filePath, message = 'Delete post via dashboard') {
    try {
      const existing = await this._apiRequest('GET', filePath);
      if (!existing || !existing.sha) {
        throw new Error('File not found on GitHub');
      }

      const body = {
        message,
        sha: existing.sha,
        branch: this.branch
      };

      await this._apiRequest('DELETE', filePath, body);
      return true;
    } catch (error) {
      Logger.error(`GitHub deleteFile error: ${filePath}`, error);
      throw error;
    }
  }

  async getAllPosts() {
    if (!this.enabled) return [];

    const published = await this.listFiles(this.publishedPath);
    const drafts = await this.listFiles(this.draftsPath);

    const allFiles = [
      ...published.map(f => ({ ...f, draft: false, sourcePath: this.publishedPath })),
      ...drafts.map(f => ({ ...f, draft: true, sourcePath: this.draftsPath }))
    ];

    const posts = [];
    for (const file of allFiles) {
      const data = await this.getFileContent(`${file.sourcePath}/${file.name}`);
      if (data) {
        const matter = this._parseFrontmatter(data.content);
        if (matter) {
          posts.push({
            ...matter.data,
            slug: file.name.replace('.md', ''),
            content: matter.content,
            draft: file.draft,
            githubPath: `${file.sourcePath}/${file.name}`,
            sha: data.sha
          });
        }
      }
    }

    return posts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }

  async getPostBySlug(slug) {
    const paths = [
      `${this.publishedPath}/${slug}.md`,
      `${this.draftsPath}/${slug}.md`
    ];

    for (const filePath of paths) {
      const data = await this.getFileContent(filePath);
      if (data) {
        const matter = this._parseFrontmatter(data.content);
        if (matter) {
          return {
            ...matter.data,
            slug,
            content: matter.content,
            draft: filePath.startsWith(this.draftsPath),
            githubPath: filePath,
            sha: data.sha
          };
        }
      }
    }
    return null;
  }

  async save(filePath, postData, commitMessage) {
    const matter = this._buildFrontmatter(postData);
    const content = matter + (postData.content || '');
    return this.saveFile(filePath, content, commitMessage);
  }

  async delete(filePath) {
    return this.deleteFile(filePath);
  }

  _parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      return { data: {}, content };
    }

    const data = {};
    const lines = match[1].split('\n');
    let currentKey = null;
    let currentArray = null;

    for (const line of lines) {
      const arrayItem = line.match(/^\s+-\s(.+)$/);
      if (arrayItem && currentKey) {
        if (!Array.isArray(data[currentKey])) {
          data[currentKey] = [];
        }
        data[currentKey].push(arrayItem[1].trim());
        continue;
      }

      const kv = line.match(/^(\w+):\s?(.*)$/);
      if (kv) {
        currentKey = kv[1];
        let val = kv[2].trim();
        if (val === 'true') val = true;
        else if (val === 'false') val = false;
        else if (!isNaN(val) && val !== '') val = Number(val);
        data[currentKey] = val;
      }
    }

    return { data, content: match[2].trimStart() };
  }

  _buildFrontmatter(data) {
    let frontmatter = '---\n';
    for (const [key, value] of Object.entries(data)) {
      if (key === 'content' || key === 'htmlContent' || key === 'sha' || key === 'githubPath') continue;
      if (key === 'slug') continue;
      if (Array.isArray(value)) {
        frontmatter += `${key}:\n`;
        for (const item of value) {
          frontmatter += `  - ${item}\n`;
        }
      } else if (typeof value === 'boolean') {
        frontmatter += `${key}: ${value}\n`;
      } else {
        frontmatter += `${key}: ${value}\n`;
      }
    }
    frontmatter += '---\n\n';
    return frontmatter;
  }
}

module.exports = new GithubService();
