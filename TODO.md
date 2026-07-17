# TODO Producción — arevdev.com

> Auditoría actualizada al 2026-07-08. Estado real del proyecto vs. producción.

---

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| 🔴 Bloqueante | Impide el deploy. Sin esto no puede salir a producción |
| 🟡 Importante | Necesario para un MVP funcional y seguro |
| 🟢 Mejora | Post-MVP, mejora la calidad |
| ⚪ Futuro | Para después del MVP |

---

## 1. 🔴 BLOQUEANTES (RESUELVASE ANTES DE PRODUCCIÓN)

### Autenticación

- [ ] **Implementar POST /login** — Actualmente solo existe GET que renderiza el formulario. No hay endpoint que procese credenciales y cree la sesión.
  - Crear controlador `src/controllers/auth/login.controller.js` con `loginPost(req, res)`
  - Usar `authService.login()` y `req.session.user = user`
- [ ] **Descomentar y conectar routers de auth** — `register.router.js`, `password.router.js`, `reset-password.router.js` están comentados en `src/router/auth/index.js:6-8`
- [ ] **Corregir `login.router.js`** — Importa `{ login, passwordReset }` de `../../controllers` pero ese index exporta objetos, no funciones directas. Ruta rota si se descomenta.
- [ ] **Agregar rate limiting a login/contacto** — `express-rate-limit` instalado pero no usado. Aplicar en POST /login y POST /contact.

### Post Repository

- [ ] **Corregir `src/repositories/post.repository.js:7`** — `contentPath` está hardcodeado a `src/content/en`. Ignora posts en español.
  - Debe buscar en `src/content/{es,en}` o según locale.
- [ ] **Build duplica sitemap/rss** — `build.service.js` genera inline `sitemap.xml` y `rss.xml`, pero también importa `feedService` que genera `sitemap.xml` y `feed.xml`. Hay duplicación y nombres inconsistentes.

### Seguridad

- [ ] **Eliminar hardcoded fallbacks**:
  - `src/app.js:50`: `secret: process.env.SESSION_SECRET || 'change-this-secret-in-production'`
  - `src/repositories/user.repository.js:12`: `const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'`
- [ ] **Proteger `.env` en producción** — Actualmente contiene credenciales reales de DB, admin password y session secret. Rotar todas las claves antes de subir a producción.
- [ ] **Instalar Joi o arreglar `validateRequest` middleware** — `src/middleware/validation.js:7` usa `schema.validate()` (API de Joi) pero los validators devuelven objetos planos `{errors}`. El middleware CRASHEARÁ si se usa. Solución: corregir el middleware para usar los validators existentes, o instalar Joi.

### Middleware roto

- [ ] **Arreglar o eliminar locale middleware** — `src/middleware/locale.middleware.js:1` importa `../config/i18n` que NO EXISTE. Crashea si se monta en alguna ruta.

---

## 2. 🟡 IMPORTANTE PARA MVP FUNCIONAL

### Dashboard y Admin

- [ ] **Falta POST handler para contacto y newsletter** — Las vistas existen, los services existen, pero no hay rutas POST que procesen formularios.
- [ ] **Falta proteccion de rutas admin** — `/dashboard/*` debería requerir autenticación. Actualmente no hay `requireAuth` en `src/router/admin/index.js`.

### SEO y Meta tags

- [ ] **Agregar Open Graph tags** a `src/views/layouts/base.pug` (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`)
- [ ] **Agregar Twitter Cards**
- [ ] **Agregar JSON-LD (BlogPosting schema)** en `article.pug`
- [ ] **Agregar canonical URLs** en todas las páginas
- [ ] **Completar `robots.txt`** en la raíz (vacío actualmente)

### Email

- [ ] **Integrar servicio de email** (Brevo/Resend) para:
  - Notificación al admin cuando alguien usa el formulario de contacto
  - Email de confirmación al suscribirse a newsletter
- [ ] **Configurar variables SMTP** en `.env.example`

### Infraestructura

- [ ] **Configurar PM2** con `ecosystem.config.js`
- [ ] **Configurar Nginx producción** — Usar `nginx/arevdev.conf` con paths correctos a `/var/www/arevdev/public`
- [ ] **Health check endpoint** — `src/router/system/index.js` existe pero no devuelve nada
- [ ] **Script de producción funcional** — `npm run start:prod` ejecuta `build` + `server.js`, verificar que funcione sin errores

### Logging

- [ ] **Mejorar logger para producción** — `src/utils/logger.js` es console-only. Considerar Morgan para HTTP logging (ya configurado) y un logger estructurado para errores.

---

## 3. 🟢 MEJORAS POST-MVP

### Testing y Calidad

- [ ] **Configurar ESLint** con reglas para Node.js/Express
- [ ] **Agregar tests unitarios** (Jest o Vitest) para:
  - auth.service.js
  - post.service.js
  - markdown.service.js
- [ ] **Agregar tests de integración** para rutas públicas (home, post, contacto, auth)
- [ ] **Configurar GitHub Actions** — linter → tests → build

### Performance

- [ ] **Minificar CSS en producción** — `sass --style=compressed`
- [ ] **Minificar JS** — Webpack está instalado pero sin config
- [ ] **Optimizar imágenes** — Generar WebP, responsive images (sharp o similar)
- [ ] **Cache headers** para assets estáticos en Express (ya hay en Nginx, pero Express también puede)
- [ ] `font-display: swap` en `@font-face`
- [ ] `loading="lazy"` en imágenes del blog (ya está en build.service.js)

### Monitoreo

- [ ] **Integrar analytics** (Plausible, Umami, o Google Analytics)
- [ ] **Configurar error tracking** (Sentry opcional)

---

## 4. ⚪ FUTURO

- [ ] Migrar a TypeScript
- [ ] Implementar sistema de comentarios (Disqus o custom)
- [ ] Migrar a Next.js (mencionado en README)
- [ ] Implementar monetización (ads, afiliados, cursos)
- [ ] Implementar subida de imágenes y media manager más robusto
- [ ] PWA (Service Worker, manifest)
- [ ] Modo oscuro
- [ ] Tests end-to-end (Cypress/Playwright)
- [ ] Internacionalización completa (i18n)
- [ ] Implementar búsqueda full-text con PostgreSQL
- [ ] Dockerizar la aplicación (Dockerfile + docker-compose funcional)

---

## Resumen de Prioridades

| Prioridad | Tareas | Esfuerzo estimado |
|-----------|--------|-------------------|
| 🔴 Bloqueante | ~7 tareas | 2-3 días |
| 🟡 Importante | ~12 tareas | 3-5 días |
| 🟢 Mejora | ~10 tareas | 3-4 días |
| ⚪ Futuro | ~10 tareas | Indefinido |

**Total estimado para MVP (🔴 + 🟡): ~5-8 días de trabajo.**

---

## Notas del Auditor

### Estado general: MVP INCOMPLETO

El proyecto tiene una base sólida (Prisma + PostgreSQL, bcrypt, Helmet, Express 5, Pug, SASS). La arquitectura es buena y el código está bastante limpio. Sin embargo:

**Lo más crítico es que el login no funciona** — no hay un endpoint POST que procese credenciales. Sin autenticación, el dashboard admin es inaccesible para operaciones reales.

**El post repository ignora contenido en español** porque la ruta está hardcodeada en `src/repositories/post.repository.js:7`. Esto significa que en el entorno dinámico (Express), solo se ven los posts en inglés.

**La seguridad tiene fallbacks hardcodeados** que son un riesgo si alguien corre la app sin `.env` configurado.

### Recomendación

1. Arreglar los 🔴 bloqueantes primero (2-3 días)
2. Luego los 🟡 importantes (3-5 días)
3. Hacer deploy inicial con Nginx + PM2
4. Mejoras post-MVP iterativamente

---

*Auditoría generada el 2026-07-08 basada en análisis del código fuente.*
