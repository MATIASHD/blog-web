const { marked } = require('marked');
const sanitizeHtml = require('sanitize-html');
const renderer = new marked.Renderer();

renderer.image = ({href, title, text}) => {
    return `
        <figure class="figure">
        <img
            src="${href}"
            alt="${text}"
            title="${title || text}"
            class="img-fluid mb-3 rounded"
            loading="lazy"
        >
        ${
            title ? `<figcaption>${title}</figcaption>` : ''
        }
        </figure>
    `;
};

marked.setOptions({
    renderer
});

const parseMarkdown = (content) => {
    return sanitizeHtml(marked.parse(content || ''), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'figure', 'figcaption']),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            a: ['href', 'name', 'target', 'rel'],
            img: ['src', 'alt', 'title', 'class', 'loading'],
            figure: ['class'],
            code: ['class']
        }
    });
};

module.exports = {
    parseMarkdown
}
