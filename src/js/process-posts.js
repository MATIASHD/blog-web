const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const sanitizeHtml = require('sanitize-html');
const pug = require('pug');

const srcDir = path.join(__dirname, '..');
const postsDir = path.join(srcDir, 'content');
const pugDir = path.join(srcDir, 'pug');
const assetsDir = path.join(srcDir, 'assets');
const outputDir = path.join(__dirname, '..', '..', 'dist');
const dataDir = path.join(outputDir, 'data');
const postsJsonPath = path.join(dataDir, 'posts.json');
const pagesDir = path.join(outputDir, 'pages');
const pugOutputDir = path.join(outputDir, 'pug');

// Configurar sanitize-html
const sanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'code', 'blockquote', 'p', 'hr', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td']),
  allowedAttributes: {
    'a': ['href', 'title', 'target'],
    'img': ['src', 'alt', 'title', 'width', 'height']
  }
};

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function processPosts() {
  // Importar marked dinámicamente (ES Module)
  const { marked } = await import('marked');
  marked.setOptions({
    breaks: true,
    gfm: true
  });

  // Crear directorios de salida
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }
  if (!fs.existsSync(pugOutputDir)) {
    fs.mkdirSync(pugOutputDir, { recursive: true });
  }

  // Procesar posts
  const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));

  const posts = files.map(file => {
    const filePath = path.join(postsDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    const htmlContent = sanitizeHtml(marked.parse(content), sanitizeOptions);

    return {
      slug: file.replace('.md', ''),
      title: data.title || 'Sin título',
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      tags: data.tags || [],
      content: htmlContent,
      rawContent: content
    };
  });

  // Ordenar por fecha (más reciente primero)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Escribir archivo JSON
  fs.writeFileSync(postsJsonPath, JSON.stringify(posts, null, 2), 'utf8');
  console.log(`Procesados ${posts.length} posts en ${postsJsonPath}`);

  // Compilar plantilla article.pug
  const articleTemplatePath = path.join(pugDir, 'pages', 'article.pug');
  const articleTemplate = fs.readFileSync(articleTemplatePath, 'utf8');
  const compileArticle = pug.compile(articleTemplate, { 
    filename: articleTemplatePath, 
    basedir: pugDir 
  });

  // Generar HTML para cada post
  posts.forEach(post => {
    const html = compileArticle({ post: post });
    const outputPath = path.join(pagesDir, `article-${post.slug}.html`);
    fs.writeFileSync(outputPath, html, 'utf8');
    console.log(`Generado: ${outputPath}`);
  });

  // Compilar home.pug
  const homeTemplatePath = path.join(pugDir, 'home.pug');
  const homeTemplate = fs.readFileSync(homeTemplatePath, 'utf8');
  const compileHome = pug.compile(homeTemplate, { 
    filename: homeTemplatePath, 
    basedir: pugDir 
  });
  const homeHtml = compileHome({ posts: posts });
  const homeOutputPath = path.join(outputDir, 'index.html');
  fs.writeFileSync(homeOutputPath, homeHtml, 'utf8');
  console.log(`Generado: ${homeOutputPath}`);

  // Copiar layouts y components al dist/pug (para referencia futura)
  copyDir(path.join(pugDir, 'layouts'), path.join(pugOutputDir, 'layouts'));
  copyDir(path.join(pugDir, 'components'), path.join(pugOutputDir, 'components'));
  
  // Copiar assets
  if (fs.existsSync(assetsDir)) {
    copyDir(assetsDir, path.join(outputDir, 'assets'));
    console.log('Assets copiados a dist/assets');
  }
}

processPosts().catch(err => {
  console.error('Error procesando posts:', err);
  process.exit(1);
});
