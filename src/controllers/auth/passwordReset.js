const passwordReset = (req, res) => {
  res.render('pages/passwordReset', {
    title: 'Password Reset'
  });
}
module.exports = passwordReset;