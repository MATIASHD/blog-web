const express = require('express');
const app = express();
const path = require('path');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(process.cwd(), 'src/public')));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const mainRouter = require('./router/index');

app.use('/', mainRouter);

app.use((req, res, next) => {
  res.send("Error 404: Page not found");
  next();
});

module.exports = app;