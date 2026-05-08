const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');

if (process.env.NODE_ENV === 'development') {
  const livereload = require('livereload');
  const connectLivereload = require('connect-livereload');

  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(path.join(__dirname, 'src/pug'));

  liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
      liveReloadServer.refresh('/');
    }, 100);
  });
}

app.set('view engine', 'pug');
app.set('views', './pages');
app.use(express.static('dist'));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.get('/blog/:slug', (req, res) => {
  const postPath = path.join(__dirname,'src/content', `${req.params.slug}.md`);
  const postContent = fs.readFileSync(postPath, 'utf8');
  const { data, content } = matter(postContent);
  const htmlContent = marked(content);
  res.render('post', { data, htmlContent });
});

app.use((req, res, next) => {
  res.send("Error 404: Page not found");
  next();
});

module.exports = app;