require('dotenv').config();
const Sentry = require('@sentry/node');

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
  });
}

const express = require('express');
const app = express();
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const compression = require('compression');
const cookieParser = require('cookie-parser');



app.use(compression());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'",
        'https://cdn.jsdelivr.net',
        'https://code.jquery.com'
      ],
      styleSrc: ["'self'",
        'https://cdn.jsdelivr.net',
        'https://fonts.googleapis.com'
      ],
      fontSrc: ["'self'",
        'https://fonts.gstatic.com'
      ],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
    }
  },
  strictTransportSecurity: process.env.NODE_ENV === 'production'
}));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.locals.siteUrl = process.env.SITE_URL || 'https://arevdev.com';
app.locals.analytics = {
  provider: process.env.ANALYTICS_PROVIDER || '',
  id: process.env.ANALYTICS_ID || '',
  url: process.env.ANALYTICS_URL || ''
};

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  },
}));

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0',
  setHeaders: (res, filePath) => {
    if (filePath.match(/\.(css|js|woff2?|png|jpg|jpeg|gif|svg|ico)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
}));

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(session({
  name: 'blog.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 4
  }
}));

let agentePreguntar;

import('../geminiAgent.js')
  .then(module => {
    return module.iniciarAgenteCopiloto();
  })
  .then(funcionPreguntar => {
    agentePreguntar = funcionPreguntar;
    console.log("🚀 el agente Gemini esta listo para asistir");
  })
  .catch(err => {
    console.log("ℹ️ No se pudo cargar geminiAgent:", err.message);
  });

const mainRouter = require('./router/index');
const { authenticate, errorHandler } = require('./middleware');

app.post('/dev/agente', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Falta el prompt' });
    const respuestaAgente = await agentePreguntar(prompt);
    res.json({ respuesta: respuestaAgente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del Agente' });
  }
});


app.use(authenticate);

app.use('/', mainRouter);
app.use((req, res) => {
  res.status(404).render('pages/error', { 
    title: '404',
    sustitulo: 'La página no esta disponible',
    descripcion: 'La pagina a la que intentas acceder no esta disponible o no existe más.' });
});

app.use(errorHandler);
module.exports = app;
