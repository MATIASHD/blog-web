const express = require('express');
const app = express();
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const bcrypt = require('bcrypt');

app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(process.cwd(), 'src/public')));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  name: 'blog.sid',
  secret: process.env.SESSION_SECRET || 'change-this-secret-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 4
  }
}));


const mainRouter = require('./router/index');
const { errorHandler } = require('./middleware');

app.use('/', mainRouter);

app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Pagina no encontrada' });
});

app.use(errorHandler);

module.exports = app;
