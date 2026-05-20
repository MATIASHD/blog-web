const newpostController = (req, res) => {
    res.render('pages/dashboard', {
        title: 'dashboard'
    });
};

module.exports = newpostController;