const login = (req, res) => {
  res.render('pages/login', {
    title: 'Login'
  });
}
module.exports = login;