const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');
const sanitizeHtml = require('sanitize-html');
const pug = require('pug');
const Logger = require('../utils/logger');
const { generateSitemap, generateRssFeed } = require('./feedservice');

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'src', 'content');
const OUTPUT_DIR = path.join(ROOT, 'src', 'public');
const VIEWS_DIR = path.join(ROOT, 'src', 'views');

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const defaultRender = md.renderer.rules.image;
md.renderer.rules.image = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  const src = token.attrGet('src');
  const alt = token.content || '';
  const title = token.attrGet('title') || '';
  const titleAttr = title ? ` title="${title}"` : '';
  const caption = title ? `<figcaption class="figure-caption">${title}</figcaption>` : '';
  return `<figure class="figure">
    <img src="${src}" alt="${alt}"${titleAttr} class="img-fluid mb-3 rounded" loading="lazy">
    ${caption}
  </figure>`;
};

const sanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'pre', 'code', 'blockquote', 'figure', 'figcaption',
    'iframe', 'div', 'mark', 'del', 'ins', 'sup', 'sub',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'input', 'details', 'summary', 'kbd',
  ]),
  allowedAttributes: {
    '*': ['class', 'id'],
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'loading', 'class', 'width', 'height'],
    code: ['class'],
    iframe: ['src', 'title', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen', 'referrerpolicy', 'loading'],
    div: ['class'],
    th: ['scope', 'colspan', 'rowspan'],
    td: ['colspan', 'rowspan'],
    input: ['type', 'checked', 'disabled'],
  },
  allowedIframeHostnames: ['www.youtube.com', 'www.youtube-nocookie.com'],
  allowedSchemes: ['http', 'https', 'mailto'],
};

function parseMarkdown(content) {
  const raw = md.render(content || '');
  return sanitizeHtml(raw, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'figure', 'figcaption']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'class', 'loading'],
      figure: ['class'],
      code: ['class'],
    },
  });
}

function extractGitRepo() {
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const token = process.env.GITHUB_TOKEN;
  const branch = process.env.GITHUB_BRANCH || 'main';
  if (owner && repo && token) {
    return { url: `https://${token}@github.com/${owner}/${repo}.git`, branch };
  }
  return null;
}

function pullContent() {
  const git = extractGitRepo();
  if (!git) {
    Logger.info('Build: No GitHub repo configured, using local content');
    return;
  }

  Logger.info('Build: Pulling latest content from GitHub...');

  if (fs.existsSync(CONTENT_DIR) && fs.existsSync(path.join(CONTENT_DIR, '.git'))) {
    try {
      execSync(`git pull origin ${git.branch}`, { cwd: CONTENT_DIR, stdio: 'pipe' });
      Logger.info('Build: git pull completed');
    } catch (err) {
      Logger.error('Build: git pull failed, re-cloning...', err.message);
      fs.rmSync(CONTENT_DIR, { recursive: true, force: true });
      cloneContent(git);
    }
  } else {
    if (fs.existsSync(CONTENT_DIR)) {
      fs.rmSync(CONTENT_DIR, { recursive: true, force: true });
    }
    cloneContent(git);
  }
}

function cloneContent(git) {
  Logger.info('Build: Cloning repository...');
  try {
    execSync(`git clone --depth 1 --branch ${git.branch} ${git.url} ${CONTENT_DIR}`, {
      stdio: 'pipe',
      timeout: 60000,
    });
    fs.rmSync(path.join(CONTENT_DIR, '.git'), { recursive: true, force: true });
    Logger.info('Build: Clone completed');
  } catch (err) {
    Logger.error('Build: Clone failed', err.message);
    throw err;
  }
}

function formatPost(post, slug) {
  const title = post.titulo || post.title || slug;
  const description = post.descripcion || post.description || '';
  const image = post.imagenes || post.image || '';
  const date = post.fecha || post.date || '';
  const author = post.autor || post.author || '';
  const tags = post.tags || [];

  return {
    title,
    slug,
    link: slug,
    author,
    description,
    image,
    date,
    tags: Array.isArray(tags) ? tags : [],
    category: post.categoria || post.category || '',
    draft: post.draft === true || post.draft === 'true',
    titulo: title,
    descripcion: description,
    imagenes: image,
    fecha: date,
    autor: author,
    htmlContent: parseMarkdown(post.content || ''),
    content: post.content || '',
  };
}

function readAllPosts() {
  const posts = [];

  if (!fs.existsSync(CONTENT_DIR)) {
    Logger.warn('Build: Content directory does not exist');
    return posts;
  }

  const langDirs = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const langDir of langDirs) {
    const langPath = path.join(CONTENT_DIR, langDir.name);
    const files = fs.readdirSync(langPath).filter(f => f.endsWith('.md'));

    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(langPath, file), 'utf-8');
        const { data, content } = matter(raw);
        const slug = file.replace('.md', '');
        const post = formatPost({ ...data, content, lang: langDir.name }, slug);
        if (post.draft) {
          Logger.info(`Build: Skipping draft: ${slug}`);
          continue;
        }
        posts.push(post);
      } catch (err) {
        Logger.error(`Build: Error reading ${file}`, err.message);
      }
    }
  }

  return posts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

function build() {
  Logger.info('=== Build started ===');

  pullContent();
  const posts = readAllPosts();
  Logger.info(`Build: Found ${posts.length} published posts`);

  if (posts.length === 0) {
    Logger.warn('Build: No posts to build');
    return;
  }

  const postDir = path.join(OUTPUT_DIR, 'post');
  fs.mkdirSync(postDir, { recursive: true });

  const articleTemplate = path.join(VIEWS_DIR, 'pages', 'article.pug');
  const indexTemplate = path.join(VIEWS_DIR, 'pages', 'index.pug');

  const baseOpts = {
    basedir: VIEWS_DIR,
    cache: false,
    pretty: false,
  };

  for (const post of posts) {
    try {
      const slug = post.slug;
      const outDir = path.join(postDir, slug);
      fs.mkdirSync(outDir, { recursive: true });

      const html = pug.renderFile(articleTemplate, {
        ...baseOpts,
        title: post.title,
        post,
        lang: post.lang || 'es',
        description: post.description,
      });

      fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
      Logger.info(`Build: Rendered /post/${slug}/`);
    } catch (err) {
      Logger.error(`Build: Failed rendering ${post.slug}`, err.message);
    }
  }

  try {
    const indexHtml = pug.renderFile(indexTemplate, {
      ...baseOpts,
      title: 'Inicio',
      posts,
      lang: 'es',
    });
    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexHtml, 'utf-8');
    Logger.info('Build: Rendered /index.html');
  } catch (err) {
    Logger.error('Build: Failed rendering index', err.message);
  }

  try {
    generateSitemap(posts, OUTPUT_DIR);
    generateRssFeed(posts, OUTPUT_DIR);
    Logger.info('Build: sitemap.xml and rss.xml generated');
  } catch (err) {
    Logger.error('Build: Failed generating sitemap/rss', err.message);
  }

  Logger.info('=== Build completed ===');
}

module.exports = { build };
