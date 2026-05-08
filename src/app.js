const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.render('index');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/blog/:slug', (req, res) => {
  const postPath = path.join(__dirname,'src/content', `${req.params.slug}.md`);
  const postContent = fs.readFileSync(postPath, 'utf8');
  const { data, content } = matter(postContent);
  const htmlContent = marked(content);
  res.render('post', { data, htmlContent });
});

app.get('/api/posts',(req, res)=> {
  res.json(posts);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});