<<<<<<< HEAD
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
=======
const postRepository = require('../repositories/post.repository');
const markdownService = require('./markdown.service');
const { slugify } = require('../utils/slugify');
const Logger = require('../utils/logger');

class PostService {
  normalizeTags(tags) {
    if (Array.isArray(tags)) {
      return tags.map(tag => String(tag).trim()).filter(Boolean);
    }

    if (typeof tags === 'string') {
      return tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }

    return [];
  }

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
        content: post.content,
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
        tags: this.normalizeTags(postData.tags),
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
        tags: postData.tags ? this.normalizeTags(postData.tags) : post.tags,
        category: postData.category || post.category,
        date: postData.date || post.date,
        content: postData.content || post.content
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
    const title = post.title || post.titulo || '';
    const description = post.description || post.descripcion || '';
    const image = post.image || post.imagenes || '';
    const date = post.date || post.fecha || '';
    const author = post.author || post.autor || '';
    const slug = post.slug || post.link || slugify(title);

    return {
      title,
      slug,
      link: slug,
      author,
      description,
      image,
      date,
      tags: post.tags || [],
      category: post.category || post.categoria || '',
      titulo: title,
      descripcion: description,
      imagenes: image,
      fecha: date,
      autor: author
    };
  }
}

module.exports = new PostService();
>>>>>>> 6ad1e2580b63a3f18777c8a7a79bea31c9b7f466
