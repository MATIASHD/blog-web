const postService = require('../../services/post.service'); 
const postController = {
    post: (req, res) => {
        const post = postService.getPostBySlug(req.params.slug);
        if (!post) {
            return res.status(404).render('pages/404', { title: 'Post Not Found' });
        }
        res.render('pages/article', {
            title: post.title,
            post
        });
    }
};
module.exports = postController;