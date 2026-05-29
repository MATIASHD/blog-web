const editPostController = (req, res) => {
    res.render('pages/posts', {
        title: 'dashboard'
    });
}

module.exports = {
    editPostController
};