const { marked } = require('marked');
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
    return marked.parse(content);
};

module.exports = {
    parseMarkdown
}