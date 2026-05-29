const { marked } = require('marked');
const sanitizeHtml = require('sanitize-html');
const renderer = new marked.Renderer();

renderer.image = ({ href, title, text }) => {
  const alt = text || '';
  const titleAttr = title ? ` title="${title}"` : '';
  const caption = title ? `<figcaption class="figure-caption">${title}</figcaption>` : '';
  return `
    <figure class="figure">
      <img
        src="${href}"
        alt="${alt}"
        ${titleAttr}
        class="img-fluid mb-3 rounded"
        loading="lazy"
      >
      ${caption}
    </figure>
  `;
};

marked.setOptions({ renderer });

const sanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    'img',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'pre',
    'code',
    'blockquote',
    'figure',
    'figcaption',
    'iframe',
    'div',
    'mark',
    'del',
    'ins',
    'sup',
    'sub',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'input',
    'details',
    'summary',
    'kbd',
  ]),
  allowedAttributes: {
    '*': ['class', 'id'],
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'loading', 'class', 'width', 'height'],
    code: ['class'],
    iframe: [
      'src',
      'title',
      'width',
      'height',
      'frameborder',
      'allow',
      'allowfullscreen',
      'referrerpolicy',
      'loading',
    ],
    div: ['class'],
    th: ['scope', 'colspan', 'rowspan'],
    td: ['colspan', 'rowspan'],
    input: ['type', 'checked', 'disabled'],
  },
  allowedIframeHostnames: ['www.youtube.com', 'www.youtube-nocookie.com'],
  allowedSchemes: ['http', 'https', 'mailto'],
};

const parseMarkdown = (content) => {
  const rawHtml = marked.parse(content);
  return sanitizeHtml(rawHtml, sanitizeOptions);
};

module.exports = {
  parseMarkdown,
};
