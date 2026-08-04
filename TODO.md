# TODO Producción — arevdev.com

> Auditoría actualizada al 2026-08-01 14:48 (Mejoras Post-MVP completadas). Proyecto listo para producción.

---

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| 🔴 Bloqueante | Impide el deploy. Sin esto no puede salir a producción |
| 🟡 Importante | Necesario para un MVP funcional y seguro |
| 🟢 Mejora | Post-MVP, mejora la calidad |
| ⚪ Futuro | Para después del MVP |
| ✅ Listo | Ya implementado y funcional |

---

## ✅ Lo que se completó en esta sesión

| Tarea | Archivos afectados |
|-------|-------------------|
| Verificación de items bloqueantes | Login flow, JWT auth, middleware chain, admin routes — todo OK |
| Fix `router/index.js` — healthcheck no montado | `src/router/index.js` — se agregó `router.use('/', require('./system/index'))` |
| Script de deploy | `deploy.sh` — git pull → npm install → prisma generate → build → pm2 reload |
| Dashboard admin: gestión de contactos | `adminController.js` (contacts, contactDetail, contactReply, contactDelete), `router/admin/index.js`, vistas `admin/contacts.pug`, `admin/contactDetail.pug` |
| Dashboard admin: gestión de newsletter | `adminController.js` (subscribers, subscriberDelete, subscriberExport), `router/admin/index.js`, vista `admin/subscribers.pug` |
| Navbar admin actualizada | `partials/navbar-dashboard.pug` — links a Contactos y Suscriptores |
| Open Graph tags | `layouts/base.pug` — og:title, og:description, og:image, og:url, og:type, og:site_name |
| Twitter Cards | `layouts/base.pug` — twitter:card, twitter:title, twitter:description, twitter:image, twitter:site |
| JSON-LD (BlogPosting) | `views/pages/article.pug` — schema.org BlogPosting con headline, description, image, author, publisher, dates |
| Canonical URLs | `layouts/base.pug` + `admin-layout.pug` — link rel="canonical" |
| `robots.txt` completado | `robots.txt` — Allow /, Disallow /dashboard/ y /api/, Sitemap URL |
| `SITE_URL` en vistas | `app.js` — `app.locals.siteUrl`, usado en todos los layouts |
| Email service (Brevo) | `services/email.service.js` — sendContactNotification, sendNewsletterConfirmation |
| Notificación email al recibir contacto | `homeController.js` — `emailService.sendContactNotification()` en `contactPost` |
| Email de confirmación newsletter | `homeController.js` — `emailService.sendNewsletterConfirmation()` en `newsletterPost` |
| Variables Brevo en `.env.example` | `.env.example` — BREVO_API_KEY, BREVO_FROM_EMAIL, BREVO_FROM_NAME |
| Logger mejorado para producción | `utils/logger.js` — logs a archivos con rotación por fecha y tamaño |
| Nginx: fallback a Node.js para rutas dinámicas | `nginx/arevdev.conf` — location @nodejs + /healthcheck explícito |

---

## Estado actual de la integración GitHub

| Componente | Estado | Notas |
|------------|--------|-------|
| `src/services/github.service.js` | ✅ | API client completo |
| `src/repositories/githubPost.repository.js` | ✅ | CRUD de posts vía GitHub |
| `src/services/post.service.js` | ✅ | Dual mode (local/GitHub) |
| `src/controllers/public/postController.js` | ✅ | Sirve artículos desde GitHub |
| `src/controllers/admin/posts.controller.js` | ✅ | CRUD admin via GitHub |
| `src/services/build.service.js` | ✅ | git clone → parse → render → sitemap/rss |
| `src/router/webhook/index.js` | ✅ | Webhook para rebuild automático |
| Build completo probado | ✅ | 6 posts generados correctamente |

---

## 1. 🔴 BLOQUEANTES (RESUELVASE ANTES DE PRODUCCIÓN)

### Autenticación

- [x] **Verificar flujo login completo** — ✅ Login funciona: POST /api/auth/login redirige a /dashboard, errores se muestran, authenticate + requireAuth + requireAdmin funcionan en cadena.
- [x] **Conectar routers comentados** — ✅ No existen routers comentados. Login GET via public/index.js, API via api/index.js. Todo correctamente montado.
- [x] **Verificar `admin/index.js`** — ✅ `requireAuth` y `requireAdmin` están montados y rutas protegidas funcionan.

### Seguridad

- [x] **Rotar credenciales en `.env` para producción** — ✅ Ya generados con `openssl rand -hex 32`.
- [x] **Configurar `GITHUB_WEBHOOK_SECRET`** — ✅ Configurado en `.env`.

### Infraestructura

- [x] **Script de deploy** — ✅ `deploy.sh` creado: git pull → npm install → prisma generate → build → pm2 reload.
- [x] **Verificar `npm run start:prod`** — ✅ Ejecuta build + node server.js sin errores.
- [x] **Verificar healthcheck** — ✅ `GET /healthcheck` responde `{ status: 'ok' }`. Se montó `router/system/index.js` en `router/index.js`.

---

## 2. 🟡 IMPORTANTE PARA MVP FUNCIONAL

### Dashboard y Admin

- [x] **Agregar gestión de contacto desde el admin** — ✅ Ver lista, ver detalle, marcar como respondido, eliminar.
- [x] **Agregar gestión de newsletter desde admin** — ✅ Ver suscriptores, eliminar, exportar a CSV.

### SEO y Meta tags

- [x] **Agregar Open Graph tags** — ✅ og:title, og:description, og:image, og:url, og:type, og:site_name en `base.pug`.
- [x] **Agregar Twitter Cards** — ✅ summary_large_image con title, description, image, site.
- [x] **Agregar JSON-LD (BlogPosting schema)** — ✅ en `article.pug` con headline, description, image, author, publisher, fechas.
- [x] **Agregar canonical URLs** — ✅ en `base.pug` y `admin-layout.pug`.
- [x] **Completar `robots.txt`** — ✅ Allow /, Disallow /dashboard/ y /api/, Sitemap.
- [x] **Agregar `SITE_URL` en las vistas** — ✅ `app.locals.siteUrl` configurado en `app.js`.

### Email

- [x] **Integrar servicio de email (Brevo)** — ✅ `email.service.js` con notificación al admin en contacto y confirmación a suscriptor de newsletter.
- [x] **Agregar variables de API de email** — ✅ `BREVO_API_KEY`, `BREVO_FROM_EMAIL`, `BREVO_FROM_NAME` en `.env.example`.

### Logging

- [x] **Mejorar logger para producción** — ✅ Logger escribe a `logs/` con rotación por fecha y tamaño. Errores con stack trace limitado.

---

## 3. 🟢 MEJORAS POST-MVP

### Testing y Calidad

- [x] **Configurar ESLint** con reglas para Node.js/Express (Implementado: eslint.config.mjs + npm scripts)
- [x] **Agregar tests unitarios** (Jest o Vitest) para servicios críticos (Implementado: Vitest tests para AuthService y ContactService)
- [x] **Agregar tests de integración** para rutas públicas (Implementado: Supertest tests para rutas públicas)
- [x] **Configurar GitHub Actions** — linter → tests → build (Implementado: workflow .github/workflows/ci.yml)

### Performance

- [x] **Minificar CSS en producción** — `sass --style=compressed` (Implementado: sass:prod npm script)
- [x] `font-display: swap` en `@font-face` (Implementado: src/sass/base/_font.scss)
- [x] **Cache headers para assets estáticos** (ya configurado en Nginx y Express static fallback)

### Monitoreo

- [x] **Integrar analytics** (Plausible, Umami, o Google Analytics) (Implementado: base.pug condicionales + app.js)
- [x] **Configurar error tracking** (Sentry opcional) (Implementado: Sentry init en app.js + capture en errorHandler)

---

## 4. ⚪ FUTURO

- [ ] Migrar a TypeScript
- [ ] Implementar sistema de comentarios (Disqus o custom)
- [ ] Migrar a Next.js
- [ ] Implementar monetización
- [ ] Implementar subida de imágenes y media manager más robusto
- [ ] PWA (Service Worker, manifest)
- [ ] Modo oscuro
- [ ] Tests end-to-end (Cypress/Playwright)
- [ ] Internacionalización completa (i18n)
- [ ] Búsqueda full-text con PostgreSQL
- [ ] Dockerizar la aplicación

---

## PM2 — Explicación y uso

**PM2** es un administrador de procesos para aplicaciones Node.js en producción. Mantiene la app corriendo, la reinicia si crashea, y maneja logs.

### Instalación
```bash
npm install -g pm2
```

### Comandos básicos
```bash
# Iniciar la app (usa ecosystem.config.js)
pm2 start ecosystem.config.js

# Ver estado
pm2 status
pm2 list

# Ver logs
pm2 logs arevdev
pm2 logs arevdev --lines 100

# Reiniciar
pm2 restart arevdev

# Detener
pm2 stop arevdev

# Que PM2 arranque automáticamente al iniciar el servidor
pm2 startup
pm2 save
```

### ecosystem.config.js (ya creado)
```js
module.exports = {
  apps: [{
    name: 'arevdev',          // Nombre del proceso
    script: 'server.js',      // Entry point
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    instances: 1,             // 1 instancia (fork)
    exec_mode: 'fork',        // Modo fork (no cluster)
    max_memory_restart: '300M', // Reiniciar si pasa 300MB
    error_file: 'logs/pm2-error.log',
    out_file: 'logs/pm2-out.log',
    max_restarts: 10,          // Máximo 10 reinicios
    restart_delay: 4000,       // Esperar 4s entre reinicios
  }],
};
```

---

## Resumen de Prioridades

| Prioridad | Tareas | Esfuerzo estimado |
|-----------|--------|-------------------|
| 🔴 Bloqueante | ✅ Completado | 0 restante |
| 🟡 Importante | ✅ Completado | 0 restante |
| 🟢 Mejora | ~8 tareas | 2-3 días |
| ⚪ Futuro | ~10 tareas | Indefinido |

**Total estimado para MVP (🔴 + 🟡): Completado.**

---

## Notas sobre cambios realizados

### Decisión sobre sitemap/rss duplicados
Se eliminó la generación inline de sitemap y rss dentro de `build.service.js` y se unificó todo en `feedservice.js`, que ahora:
- Genera `sitemap.xml` con URLs correctas (`/post/{slug}/` en vez de `/articles/{slug}`)
- Genera `rss.xml` (antes `feed.xml`) con atom:link, language=es, y manejo seguro de fechas
- Filtra por `!a.draft` en vez de `a.published` (que no existe en los artículos del build)

### Decisión sobre inglés
Se cambió `post.repository.js` para que solo busque en `src/content/es/`. El build estático sigue soportando ambos idiomas porque itera sobre todos los subdirectorios de `src/content/`. Esto permite que el build genere páginas estáticas en ambos idiomas, mientras que el servidor dinámico solo sirve español.

### Decisión sobre validación
Se reescribió `validation.js` para usar los validators existentes (que devuelven objetos `{errors}`) en lugar de la API de Joi. El middleware `validateRequest` ahora acepta uno o más validadores y acumula errores. Compatible con express-validation si se quiere migrar después.

### Decisión sobre email service
Se eligió Brevo (ex Sendinblue) por su generoso tier gratuito (300 emails/día). El servicio `email.service.js` usa la API REST de Brevo vía `https` nativo de Node.js, sin dependencias adicionales. Si Brevo no está configurado, los emails se omiten silenciosamente (loggeados como INFO).

### Decisión sobre logging
Se mejoró `logger.js` para que escriba a archivos en `logs/` con rotación automática por fecha y por tamaño (5MB). Los errores incluyen stack trace limitado a 4 líneas para evitar ruido. Compatible con PM2 y Morgan.

---

*Auditoría y Mejoras Post-MVP completadas al 2026-08-01 14:48.*
