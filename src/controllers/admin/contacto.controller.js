const contactoController = (req, res) => {
    res.render('pages/contacts', {
        title: 'Contactos'
    });
}

module.exports = {
    contactoController
};