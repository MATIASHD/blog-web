const fs = require('fs');
const path = require('path');

const SITE_URL = (process.env.SITE_URL || 'https://arevdev.com').replace(/\/$/, '');
const SITE_TITLE = 'ArevDev';
const SITE_DESCRIPTION = 'Programación, tecnología y su impacto en la geopolítica y la economía.';

/**
 * Escapa caracteres especiales de XML para evitar romper el documento
 * si un título o excerpt trae &, <, >, comillas, etc.
 */
function escapeXml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Genera sitemap.xml con la home y cada artículo publicado.
 * Los buscadores lo usan para descubrir e indexar contenido nuevo.
 */
function generateSitemap(articles, staticOutputPath) {
  const published = articles.filter((a) => a.published);

  const urls = [
    `  <url>\n    <loc>${SITE_URL}/</loc>\n    <changefreq>daily</changefreq>\n  </url>`,
    ...published.map((a) => {
      const lastmod = a.date.toISOString().split('T')[0];
      return `  <url>\n    <loc>${SITE_URL}/articles/${a.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n  </url>`;
    }),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

  fs.writeFileSync(path.join(staticOutputPath, 'sitemap.xml'), xml);
}

/**
 * Genera feed.xml (RSS 2.0) con los últimos artículos publicados.
 * limit corta el feed para no mandar el historial completo cada vez.
 */
function generateRssFeed(articles, staticOutputPath, limit = 20) {
  const published = articles
    .filter((a) => a.published)
    .sort((a, b) => b.date - a.date)
    .slice(0, limit);

  const items = published.map((a) => {
    const link = `${SITE_URL}/articles/${a.slug}`;
    return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${a.date.toUTCString()}</pubDate>
      <description>${escapeXml(a.excerpt)}</description>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items.join('\n')}
  </channel>
</rss>
`;

  fs.writeFileSync(path.join(staticOutputPath, 'feed.xml'), xml);
}

module.exports = { generateSitemap, generateRssFeed };