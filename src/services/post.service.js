const fs = require('fs');
const path = require('path');
//const marked = require('marked');
const matter = require('gray-matter');

const markdownService = require('./markdown.service');
const contentPath = path.join(process.cwd(),'src/content');

const obtenerTodosLosPost = () => {
    const archivos = fs.readdirSync(contentPath).filter(filtrar => filtrar.endsWith('.md'));
    const publicaciones = archivos.map( archivo => {
        const rutaDelArchivo = path.join(contentPath, archivo);
        const contenidoDelArchivo = fs.readFileSync(rutaDelArchivo, 'utf-8');
        const { data } = matter(contenidoDelArchivo);

        return {
            link: data.link,
            titulo: data.title,
            autor: data.author,
            descripcion: data.description,
            imagenes: data.image,
            fecha: data.date,
            tags: data.tags
        };
    });
    return publicaciones
};

const obtenerPost = (entrada) =>{
    console.log(entrada)
    const contentPath = path.join(
        process.cwd(),
        'src',
        'content',
        `${entrada}.md`
    );
    const postContent = fs.readFileSync(contentPath, 'utf8');
    const { data, content } = matter(postContent);
    const htmlContent = markdownService.parseMarkdown(content);
    return {
        link: data.link,
        titulo: data.title,
        autor: data.author,
        descripcion: data.description,
        imagenes: data.image,
        fecha: data.date,
        slug: data.tags,
        htmlContent
    }
}
module.exports = {
    obtenerTodosLosPost,
    obtenerPost
};