const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { isSupportedLang, DEFAULT_LANG } = require('../config/i18n');
const { slugify } = require('../utils/slug');
const markdownService = require('./markdown.service');

const contentRoot = path.join(process.cwd(), 'src', 'content');

const normalizeTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map(String);
  return [String(tags)];
};

const normalizePostMeta = (data, lang, fileName) => {
  const slug = data.slug || data.link || path.basename(fileName, '.md');
  const id = data.id || slug;
  const postLang = data.lang || lang;

  return {
    id,
    slug,
    lang: postLang,
    translationOf: data.translationOf || id,
    title: data.title || slug,
    description: data.description || '',
    author: data.author || 'Matias Arevalo',
    date: data.date || new Date().toISOString().slice(0, 10),
    image: data.image || null,
    category: data.category || 'General',
    tags: normalizeTags(data.tags),
    draft: Boolean(data.draft),
    seoTitle: data.seoTitle || data.title || slug,
    seoDescription: data.seoDescription || data.description || '',
    comments: Boolean(data.comments),
    url: `/${postLang}/blog/${slug}`,
  };
};

const readPostsFromLang = (lang) => {
  if (!isSupportedLang(lang)) return [];

  const langDir = path.join(contentRoot, lang);
  if (!fs.existsSync(langDir)) return [];

  const files = fs
    .readdirSync(langDir)
    .filter((file) => file.endsWith('.md'));

  return files.map((fileName) => {
    const filePath = path.join(langDir, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    return normalizePostMeta(data, lang, fileName);
  });
};

const sortByDateDesc = (posts) =>
  [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

const obtenerTodosLosPost = (options = {}) => {
  const lang = options.lang || DEFAULT_LANG;
  const includeDrafts = Boolean(options.includeDrafts);

  let posts = readPostsFromLang(lang);

  if (!includeDrafts) {
    posts = posts.filter((post) => !post.draft);
  }

  if (options.category) {
    const categorySlug = slugify(options.category);
    posts = posts.filter((post) => slugify(post.category) === categorySlug);
  }

  if (options.tag) {
    const tagSlug = slugify(options.tag);
    posts = posts.filter((post) =>
      post.tags.some((tag) => slugify(tag) === tagSlug)
    );
  }

  if (options.q) {
    const query = options.q.trim().toLowerCase();
    if (query) {
      posts = posts.filter((post) => {
        const haystack = [
          post.title,
          post.description,
          post.author,
          post.category,
          ...post.tags,
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
      });
    }
  }

  return sortByDateDesc(posts);
};

const obtenerPost = (slug, lang = DEFAULT_LANG) => {
  if (!isSupportedLang(lang)) {
    throw new Error(`Idioma no soportado: ${lang}`);
  }

  const filePath = path.join(contentRoot, lang, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Post no encontrado: ${slug} (${lang})`);
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const meta = normalizePostMeta(data, lang, `${slug}.md`);

  if (meta.draft && process.env.NODE_ENV === 'production') {
    throw new Error(`Post no publicado: ${slug}`);
  }

  const htmlContent = markdownService.parseMarkdown(content);

  return {
    ...meta,
    titulo: meta.title,
    descripcion: meta.description,
    autor: meta.author,
    imagenes: meta.image,
    fecha: meta.date,
    link: meta.slug,
    tagLinks: meta.tags.map((name) => ({ nombre: name, slug: slugify(name) })),
    htmlContent,
  };
};

const obtenerCategorias = (lang = DEFAULT_LANG) => {
  const posts = obtenerTodosLosPost({ lang });
  const counts = new Map();

  posts.forEach((post) => {
    const key = slugify(post.category);
    if (!counts.has(key)) {
      counts.set(key, { nombre: post.category, slug: key, count: 0 });
    }
    counts.get(key).count += 1;
  });

  return [...counts.values()].sort((a, b) => a.nombre.localeCompare(b.nombre));
};

const obtenerTags = (lang = DEFAULT_LANG) => {
  const posts = obtenerTodosLosPost({ lang });
  const counts = new Map();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      const key = slugify(tag);
      if (!counts.has(key)) {
        counts.set(key, { nombre: tag, slug: key, count: 0 });
      }
      counts.get(key).count += 1;
    });
  });

  return [...counts.values()].sort((a, b) => a.nombre.localeCompare(b.nombre));
};

const obtenerTraduccion = (post) => {
  const otherLang = post.lang === 'es' ? 'en' : 'es';
  const posts = obtenerTodosLosPost({ lang: otherLang });
  return (
    posts.find((p) => p.translationOf === post.translationOf && p.lang !== post.lang) ||
    null
  );
};

module.exports = {
  obtenerTodosLosPost,
  obtenerPost,
  obtenerCategorias,
  obtenerTags,
  obtenerTraduccion,
};
