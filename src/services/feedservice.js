const fs = require('fs');
const path = require('path');

const SITE_URL = (process.env.SITE_URL || 'https://arevdev.com').replace(/\/$/, '');
const SITE_TITLE = 'ArevDev';
const SITE_DESCRIPTION = 'Programación, tecnología y su impacto en la geopolítica y la economía.';

function escapeXml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatDate(date) {
  if (!date) return new Date().toISOString().split('T')[0];
  try {
    return new Date(date).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

function formatUTCDate(date) {
  if (!date) return new Date().toUTCString();
  try {
    return new Date(date).toUTCString();
  } catch {
    return new Date().toUTCString();
  }
}

function generateSitemap(articles, staticOutputPath) {
  const published = articles.filter((a) => !a.draft);

  const urls = [
    `  <url>\n    <loc>${SITE_URL}/</loc>\n    <changefreq>daily</changefreq>\n  </url>`,
    `  <url>\n    <loc>${SITE_URL}/about</loc>\n    <changefreq>monthly</changefreq>\n  </url>`,
    `  <url>\n    <loc>${SITE_URL}/contact</loc>\n    <changefreq>monthly</changefreq>\n  </url>`,
    ...published.map((a) => {
      const lastmod = formatDate(a.date);
      return `  <url>\n    <loc>${SITE_URL}/post/${a.slug}/</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n  </url>`;
    }),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

  fs.writeFileSync(path.join(staticOutputPath, 'sitemap.xml'), xml);
}

function generateRssFeed(articles, staticOutputPath, limit = 20) {
  const published = articles
    .filter((a) => !a.draft)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, limit);

  const items = published.map((a) => {
    const link = `${SITE_URL}/post/${a.slug}/`;
    return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${formatUTCDate(a.date)}</pubDate>
      <description>${escapeXml(a.description || a.excerpt || '')}</description>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>es</language>
${items.join('\n')}
  </channel>
</rss>
`;

  fs.writeFileSync(path.join(staticOutputPath, 'rss.xml'), xml);
}

module.exports = { generateSitemap, generateRssFeed };
