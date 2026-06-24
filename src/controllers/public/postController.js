const postService = require('../../services/post.service'); 
const postController = {
    post: (req, res) => {
        console.log(req.params.slug);

        const post = postService.getPostBySlug(req.params.slug);
        console.log('Post found:', post);
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