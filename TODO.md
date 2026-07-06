# TODO MVP — Blog de Matias Arevalo

> Análisis completo del proyecto para llevarlo a producción como un MVP robusto.

---

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| 🔴 Crítico | Debe hacerse antes de subir a producción |
| 🟡 Importante | Necesario para un MVP funcional |
| 🟢 Mejora | Nice-to-have post-MVP |
| ⚪ Futuro | Para después del MVP |

---

## 1. 🔴 SEGURIDAD

- [ ] **Reemplazar SHA256 por bcrypt** para hashing de contraseñas
  - Archivos: `src/services/auth.service.js` y `src/repositories/user.repository.js`
  - SHA256 es rápido y sin salt — inseguro para producción
  - Instalar `bcrypt` (o `bcryptjs`)
- [ ] **Configurar SESSION_SECRET real** en `.env`
  - Actual: `'change-this-secret-in-production'` hardcodeado como fallback
  - Generar un secreto fuerte (`openssl rand -hex 32`)
- [ ] **Configurar ADMIN_PASSWORD real** en `.env`
  - Actual: fallback a `'admin123'`
- [ ] **Agregar rate limiting** (`express-rate-limit`)
  - Especialmente en rutas de login, registro y contacto
- [ ] **Agregar CSRF protection** (`csurf` o similar)
  - Los formularios POST son vulnerables sin esto
- [ ] **Validar que `secure: true` en session cookie solo se active con HTTPS real**
  - Actual: `secure: process.env.NODE_ENV === 'production'`
  - Asegurarse de que NODE_ENV=production esté correctamente seteado en el deploy

## 2. 🔴 RENDERIZADO Y TEMPLATES

- [ ] **Restaurar o reimplementar los controladores eliminados** (cambios unstaged)
  - Archivos eliminados: `src/controllers/admin/*`, `src/controllers/auth/*`,
    `src/controllers/public/*`, `src/controllers/seo/*`, `src/controllers/system/*`
  - Sin estos controladores, las rutas de admin y auth están rotas
- [ ] **Verificar que todas las rutas públicas funcionan correctamente**
  - Home, Blog, Artículo individual, About, Contacto, Newsletter, Search, Tags
- [ ] **Completar vistas que están vacías**
  - `src/views/partials/seo.pug`
  - `src/views/partials/header.pug`
  - `src/views/partials/scripts.pug`
  - `src/views/layouts/auth-layout.pug`
  - `src/views/bashboard/*.pug` (to-do el dashboard admin)
- [ ] **Agregar página de error personalizada (500)**
  - Actual: solo hay 404 (`pages/404`)
- [ ] **Verificar que el locale middleware está activo** o implementar i18n funcional
  - `src/middleware/locale.middleware.js` existe pero no está conectado al router
  - `src/config/i18n.js` fue eliminado (unstaged)

## 3. 🔴 SEO Y DESCUBRIMIENTO

- [ ] **Generar `sitemap.xml` dinámico**
  - Incluir todas las URLs: home, blog, artículos, about, contacto, tags
  - Usar el router SEO comentado en `src/router/seo/index.js`
- [ ] **Completar `robots.txt`**
  - Actual: archivo vacío
- [ ] **Generar `rss.xml` dinámico** con los posts del blog
- [ ] **Agregar Open Graph tags** (`og:title`, `og:description`, `og:image`, `og:url`)
  - En `src/views/layouts/base.pug`
- [ ] **Agregar Twitter Cards**
- [ ] **Agregar etiquetas `hreflang`** para el contenido bilingüe
- [ ] **Agregar canonical URLs** para evitar contenido duplicado
- [ ] **Agregar JSON-LD structured data** (BlogPosting schema)

## 4. 🟡 RENDIMIENTO

- [ ] **Activar compression middleware**
  - `compression` está en `package.json` como dependencia pero **no está registrado** en `app.js`
  - Agregar `app.use(compression())`
- [ ] **Configurar caché de navegador** para archivos estáticos
  - Agregar `Cache-Control` y `ETag` apropiados en `express.static`
- [ ] **Minificar CSS en producción** (cssnano o similar)
  - Actual: SASS compila pero no minifica
- [ ] **Minificar JS en producción** (terser vía webpack o similar)
  - Webpack está instalado pero no configurado
- [ ] **Optimizar imágenes automáticamente** (sharp, imagemin, o servicio externo)
  - Agregar generación de WebP, responsive images
- [ ] **Cargar fonts de forma óptima** (font-display: swap, preload)
  - Archivo: `src/sass/base/_font.scss`

## 5. 🟡 INFRAESTRUCTURA Y DEPLOY

- [ ] **Configurar repositorio remoto** (GitHub, GitLab, etc.)
  - Actual: `git remote -v` no devuelve nada
- [ ] **Crear script de producción** en `package.json`
  - Ej: `"start:prod": "NODE_ENV=production node server.js"`
  - El script `start` actual usa `nodemon` y `sass:watch` — no apto para producción
- [ ] **Crear Dockerfile** para el servicio Node.js
  - `docker-compose.yml` está vacío
- [ ] **Configurar variables de entorno para producción**
  - `.env` actual tiene valores vacíos (`DB_URI=`, `SESSION_SECRET=`, `SMTP_HOST=`)
  - `.env.example` pide más vars de las que usa el proyecto (`DB_HOST`, `DB_USER`, etc.)
- [ ] **Migrar de almacenamiento en archivos a base de datos**
  - Actual: posts en `.md`, usuarios/contactos/newsletter en `.json`
  - El README menciona MySQL + Prisma
  - Para MVP: al menos migrar usuarios y contactos a SQLite (mínimo esfuerzo) o MySQL/PostgreSQL
- [ ] **Configurar PM2** para manejo de procesos en producción
  - Con archivo `ecosystem.config.js`
- [ ] **Agregar Health Check endpoint** funcional
  - `src/router/system/index.js` existe pero no tiene controller

## 6. 🟡 ANALÍTICA Y MONITOREO

- [ ] **Integrar analytics** (Plausible, Umami, o Google Analytics)
  - README recomienda Plausible/Umami por privacidad
- [ ] **Configurar logging estructurado**
  - `src/utils/logger.js` es básico (console.log wrapper)
  - Considerar Winston o Pino para producción
  - Morgan ya está configurado con formato `combined` en producción

## 7. 🟡 PRUEBAS Y CALIDAD

- [ ] **Configurar linter** (ESLint con reglas para Node.js)
- [ ] **Agregar pruebas unitarias** para servicios críticos
  - `src/services/auth.service.js`
  - `src/services/post.service.js`
  - `src/services/markdown.service.js`
- [ ] **Agregar pruebas de integración** para rutas públicas
  - Home, blog listing, artículo individual, contacto
- [ ] **Configurar CI/CD** (GitHub Actions)
  - Linter → Tests → Build → Deploy

## 8. 🟢 FUNCIONALIDADES ADICIONALES

- [ ] **Implementar panel admin funcional**
  - CRUD de posts, media, usuarios, SEO
  - `src/views/bashboard/` está vacío
  - `src/router/admin/posts.router.js` referencia controller eliminado
- [ ] **Completar sistema de newsletter**
  - `src/services/newsletter.service.js` tiene subscribe/unsubscribe con tokens
  - Falta integración SMTP real y emails transaccionales
- [ ] **Agregar paginación funcional en /blog**
  - Constante `ITEMS_PER_PAGE: 10` definida pero verificar que la vista lo respeta
- [ ] **Mejorar el buscador interno**
  - `src/services/search.service.js` tiene búsqueda full-text con filtros
  - Verificar que funciona correctamente desde la vista
- [ ] **Agregar sistema de comentarios** (Disqus, o custom con moderación)
- [ ] **Agregar formulario de contacto funcional con notificación por email**

## 9. ⚪ FUTURO (POST-MVP)

- [ ] Migrar a Next.js (mencionado en README como roadmap futuro)
- [ ] Implementar monetización (ads, afiliados, cursos)
- [ ] Agregar CDN (Cloudflare)
- [ ] Implementar soporte PWA (Service Worker, manifest)
- [ ] Migrar a TypeScript
- [ ] Agregar modo oscuro
- [ ] Implementar subida de imágenes y media manager
- [ ] Agregar tests end-to-end (Cypress/Playwright)
- [ ] Internacionalización completa (i18n)

---

## Resumen de Prioridades

| Prioridad | Tareas | Esfuerzo estimado |
|-----------|--------|-------------------|
| 🔴 Crítico | ~16 tareas | 2-3 días |
| 🟡 Importante | ~15 tareas | 3-5 días |
| 🟢 Mejora | ~6 tareas | 2-3 días |
| ⚪ Futuro | ~8 tareas | Indefinido |

**Total estimado para MVP:** ~7-11 días de trabajo continuo.

---

*Generado el 2026-06-07 basado en análisis del código fuente.*

-----------------------------------------------------------
Excelente, Matías. Con tus respuestas ya puedo armarte un plan quirúrgico. Esto es lo que necesitás saber antes de la ejecución:
Sobre email: mis recomendaciones
Servicio	Free tier	Pago desde	Para qué
Resend	100 emails/día	$10/mes (50k)	Formulario de contacto (API simple, dev-friendly)
Brevo	300 emails/día	$25/mes (20k)	Newsletters + Contacto (todo en uno, buen free tier)
MailerLite	1000 suscriptores	$10/mes	Solo newsletters (mejor UX para landing)
Mi recomendación: Empezá con Brevo (free tier te da 300 mails/día, te cubre contacto + newsletter sin pagar un peso). Si escalás, ahí pasás a Resend o MailerLite.
Sobre seguridad: tips clave
- Cloudflare: poné el modo SSL Full (strict) — Hostinger te da cert, Cloudflare lo envuelve. Activá WAF en modo "Essentials" y Under Attack Mode solo si te atacan.
- En el VPS: ufw firewall (solo puertos 22, 80, 443), fail2ban contra SSH brute force, Nginx hardening (ocultar versión, limitar request rate).
- En el código: rate limiting en login/contacto (express-rate-limit), CSRF en formularios, bcrypt ya (lo cubre Fase 1), helmet ya está.
- Cloudflare Tunnel (alternativa más segura que abrir puertos): no obligatorio pero recomendable a futuro.
PLAN DE ACCIÓN: arevdev.com — 2 Meses
FASE 0 — Fundación (Semana 1)
[ ] Crear repo en GitHub (privado o público, como quieras)
[ ] git remote add + push inicial
[ ] Contratar VPS Hostinger (Ubuntu 22.04/24.04, plan más básico basta)
[ ] Conectarte por SSH, instalar:
    - Node.js 20 LTS
    - MySQL 8
    - Nginx
    - Git
[ ] Poner Cloudflare delante de arevdev.com (DNS → IP del VPS)
[ ] SSL: Cloudflare Full (strict) — listo, no tocar Hostinger SSL
[ ] Crear DB MySQL + usuario para la app
FASE 1 — Seguridad + Código Crítico (Semana 1-2)
[ ] Reemplazar SHA256 por bcrypt en src/services/auth.service.js
    - bcryptjs ya está instalado, solo hay que usarlo
[ ] Eliminar const bcrypt = require('bcrypt') de app.js (no se usa, genera ruido)
[ ] Generar SESSION_SECRET fuerte (openssl rand -hex 32) y ponerlo en .env
[ ] Generar ADMIN_PASSWORD fuerte y ponerlo en .env
[ ] Activar compression middleware en app.js (app.use(compression()))
[ ] simplificar / eliminar locale middleware (arrancás solo español)
    - locale.middleware.js requiere config/i18n.js que no existe
    - borrar o reemplazar con un middleware mínimo
[ ] Instalar express-rate-limit, aplicar en /login y /contacto
[ ] Verificar que helmet esté bien configurado (está, pero revisar)
FASE 2 — MySQL + Prisma (Semana 2-3)
[ ] npm install prisma @prisma/client
[ ] npx prisma init → configurar connection a MySQL
[ ] Definir schema: User, Contact, Newsletter
    - Post sigue en Markdown (como decidiste)
[ ] npx prisma db push (crear tablas)
[ ] Migrar src/data/users.json → MySQL (seed con admin)
[ ] Migrar src/data/contacts.json → MySQL
[ ] Migrar src/data/newsletter.json → MySQL
[ ] Refactorizar repositorios:
    - user.repository.js → usar Prisma
    - contact.repository.js → usar Prisma
    - newsletter.repository.js → usar Prisma
    - post.repository.js sigue igual (Markdown)
[ ] Probar que login, registro, contacto, newsletter funcionan con DB
FASE 3 — Auth + Admin (Semanas 3-4)
[ ] Implementar controllers/auth/auth.controller.js
    - getLoginForm, login, logout
[ ] Implementar controllers/admin/posts.controller.js
    - CRUD de posts (crear, editar, listar, eliminar)
[ ] Descomentar rutas en src/router/index.js:
    - router.use('/', require('./auth'));
    - router.use('/admin', require('./admin'));
[ ] Completar vistas del dashboard (src/views/bashboard/)
    - dashboard-home, posts, post-edit, media, settings
[ ] Verificar flujo completo: login → admin → crear post → ver en blog
FASE 4 — SEO (Semana 4-5)
[ ] Implementar sitemap.xml dinámico en router/seo/
    - todas las URLs: /, /blog, /blog/:slug, /about, /contacto, /tags
[ ] Completar robots.txt (permitir todo, apuntar a sitemap)
[ ] Implementar RSS feed dinámico
[ ] Agregar Open Graph tags a src/views/layouts/base.pug
    - og:title, og:description, og:image, og:url, og:type
[ ] Agregar Twitter Cards
[ ] Agregar JSON-LD (BlogPosting schema) en article.pug
[ ] Agregar canonical URLs
[ ] Completar src/views/partials/seo.pug (está vacío)
FASE 5 — Email + Newsletter (Semana 5)
[ ] Crear cuenta en Brevo (o Resend)
[ ] Configurar API key en .env
[ ] Integrar contacto: cuando alguien envíe mensaje → email a admin
[ ] Integrar newsletter: subscribe → guardar en DB → email de confirmación
[ ] Template de email de bienvenida para newsletter
FASE 6 — Deploy a Producción (Semana 5-6)
[ ] Agregar script production en package.json:
    "start:prod": "NODE_ENV=production node server.js"
[ ] Configurar PM2:
    - npm install -g pm2
    - ecosystem.config.js con Node_ENV=production
[ ] Configurar Nginx como reverse proxy:
    - dominio arevdev.com → proxy_pass http://localhost:3000
    - static files: cache headers + gzip
    - rate limiting por IP
[ ] Pasar src/data/ a .gitignore (ya está, pero con DB ya no se usa)
[ ] Copiar .env.production con valores reales al servidor
[ ] Testear: curl localhost:3000 → curl arevdev.com
FASE 7 — Hardening + Performance (Semana 6-7)
[ ] ufw: allow 22, 80, 443; deny todo lo demás
[ ] fail2ban: configurar para SSH + Nginx
[ ] Nginx: ocultar versión, limitar request rate
[ ] Cloudflare WAF: activar reglas básicas
[ ] Minificar CSS: sass --style=compressed en producción
[ ] Minificar JS (si es necesario, el tuyo es mínimo)
[ ] Cache-Control para assets estáticos (imágenes, css, fonts)
[ ] font-display: swap en @font-face
[ ] loading="lazy" en imágenes del blog
FASE 8 — Testing + Pulido (Semana 7-8)
[ ] Recorrer manualmente todas las rutas
[ ] Probar login/registro/admin
[ ] Probar formulario de contacto (te llega el email)
[ ] Probar newsletter subscription
[ ] Lighthouse audit (performance, accesibilidad, SEO, best practices)
[ ] Verificar responsive (mobile, tablet, desktop)
[ ] Google Search Console: agregar sitemap, verificar dominio
[ ] Analytics: instalar Plausible (hosteado) o Google Analytics 4
[ ] Redirección del viejo WordPress → nuevo blog (si aplica)
[ ] Revisar que no haya console errors ni 404s
Resumen de esfuerzo
Fase	Días	Dependencias
0. Fundación	3-4	Contratar VPS, dominio en Cloudflare
1. Seguridad crítica	2-3	Ninguna
2. MySQL + Prisma	4-5	Fase 1
3. Auth + Admin	4-5	Fase 2
4. SEO	3-4	Fase 0 (sitemap necesita rutas activas)
5. Email	2-3	Fase 2 (DB para suscriptores)
6. Deploy	3-4	Fases 1-5
7. Hardening	2-3	Fase 6 (Nginx configurado)
8. Testing	3-4	Todo lo anterior
Total estimado: ~26-35 días hábiles (5-7 semanas).
¿Te parece bien este enfoque? ¿Querés que ajuste algún fase, profundice en algún punto en particular, o empecemos con la ejecución?
▣  Plan · DeepSeek V4 Flash Free · 50.6s
EScribi todo este plan en un markdown para subirlo ami repositorio
+ Thought: 2.8s
Estoy en modo planificación (read-only) y no puedo escribir archivos todavía. Acá tenés el contenido exacto del markdown para que lo crees vos mismo. Copialo y guardalo como DEPLOY-PLAN.md en la raíz del proyecto:
# Plan de Lanzamiento — arevdev.com

> Plan detallado para poner el blog en producción en un VPS con Hostinger.
> Stack: Node.js + Express + Pug + MySQL + Prisma + Markdown.
> Timeline estimado: 2 meses.

---

## Contenido

- [Email y Seguridad: Recomendaciones](#email-y-seguridad-recomendaciones)
- [Fase 0 — Fundación](#fase-0--fundacin)
- [Fase 1 — Seguridad + Código Crítico](#fase-1--seguridad--cdigo-crtico)
- [Fase 2 — MySQL + Prisma](#fase-2--mysql--prisma)
- [Fase 3 — Auth + Admin](#fase-3--auth--admin)
- [Fase 4 — SEO](#fase-4--seo)
- [Fase 5 — Email + Newsletter](#fase-5--email--newsletter)
- [Fase 6 — Deploy a Producción](#fase-6--deploy-a-produccin)
- [Fase 7 — Hardening + Performance](#fase-7--hardening--performance)
- [Fase 8 — Testing + Pulido](#fase-8--testing--pulido)
- [Resumen de esfuerzo](#resumen-de-esfuerzo)

---

## Email y Seguridad: Recomendaciones

### Servicios de email

| Servicio | Free tier | Pago desde | Para qué |
|----------|-----------|------------|----------|
| **Resend** | 100 emails/día | $10/mes (50k) | Formulario de contacto (API simple, dev-friendly) |
| **Brevo** | 300 emails/día | $25/mes (20k) | Newsletters + Contacto (todo en uno, buen free tier) |
| **MailerLite** | 1000 suscriptores gratis | $10/mes | Solo newsletters (mejor UX para landing) |

**Recomendación**: Empezar con **Brevo** (free tier: 300 mails/día, cubre contacto + newsletter). Si el blog escala, migrar a Resend o MailerLite.

### Seguridad

- **Cloudflare**: modo SSL **Full (strict)**. Activar WAF en "Essentials" y Under Attack Mode solo ante ataques.
- **VPS**: `ufw` firewall (solo puertos 22, 80, 443), `fail2ban` contra SSH brute force, Nginx hardening (ocultar versión, limitar request rate).
- **Código**: rate limiting en login/contacto (`express-rate-limit`), CSRF en formularios, bcrypt para passwords, helmet para headers HTTP.
- **Cloudflare Tunnel**: opcional para no exponer puertos directamente.

---

## Fase 0 — Fundación (Semana 1)

- [x] Crear repositorio en GitHub (privado o público)
- [x] `git remote add origin <url>` + `git push`
- [ ] Contratar VPS Hostinger (Ubuntu 24.04, plan básico)
- [ ] Conectarse por SSH e instalar:
  - Node.js 20 LTS
  - MySQL 8
  - Nginx
  - Git
- [x] Poner Cloudflare delante de `arevdev.com` (DNS apuntando a IP del VPS)
- [x] SSL: Cloudflare Full (strict)
- [x] Crear base de datos MySQL + usuario para la app

---

## Fase 1 — Seguridad + Código Crítico (Semana 1-2)

- [x] Reemplazar SHA256 por bcrypt en `src/services/auth.service.js`
  - `bcryptjs` ya está instalado como dependencia
- [x] Eliminar `const bcrypt = require('bcrypt')` de `src/app.js` (no se usa)
- [x] Generar `SESSION_SECRET` fuerte (`openssl rand -hex 32`) y ponerlo en `.env`
- [x] Generar `ADMIN_PASSWORD` fuerte y ponerlo en `.env`
- [x] Activar `compression` middleware en `app.js` (`app.use(compression())`)
- [x] Simplificar/eliminar locale middleware (se arranca solo en español)
  - `locale.middleware.js` requiere `config/i18n.js` que no existe
- [x] Instalar `express-rate-limit` y aplicarlo en `/login` y `/contacto`
- [x] Revisar configuración de helmet

---

## Fase 2 — MySQL + Prisma (Semana 2-3)

- [x] `npm install prisma @prisma/client`
- [x] `npx prisma init` — configurar conexión a MySQL
- [x] Definir schema: `User`, `Contact`, `Newsletter`
  - `Post` se mantiene en Markdown (no migrar a DB)
- [x] `npx prisma db push` — crear tablas
- [x] Migrar datos existentes:
  - `src/data/users.json` → MySQL (seed con admin)
  - `src/data/contacts.json` → MySQL
  - `src/data/newsletter.json` → MySQL
- [x] Refactorizar repositorios para usar Prisma:
  - `user.repository.js`
  - `contact.repository.js`
  - `newsletter.repository.js`
  - `post.repository.js` se queda igual (Markdown)
- [ ] Probar: login, registro, contacto, newsletter contra la DB

---

## Fase 3 — Auth + Admin (Semanas 3-4)

- [ ] Implementar `controllers/auth/auth.controller.js`
  - `getLoginForm`, `login`, `logout`
- [ ] Implementar `controllers/admin/posts.controller.js`
  - CRUD de posts (crear, editar, listar, eliminar)
- [ ] Descomentar rutas en `src/router/index.js`:
  - `router.use('/', require('./auth'))`
  - `router.use('/admin', require('./admin'))`
- [ ] Completar vistas del dashboard (`src/views/bashboard/`):
  - `dashboard-home.pug`, `posts.pug`, `post-edit.pug`, `media.pug`, `settings.pug`
- [ ] Verificar flujo completo: login → admin → crear post → ver en blog

---

## Fase 4 — SEO (Semana 4-5)

- [ ] Implementar `sitemap.xml` dinámico en `router/seo/`
  - Incluir: `/`, `/blog`, `/blog/:slug`, `/about`, `/contacto`, `/tags`
- [ ] Completar `robots.txt` (permitir todo, apuntar a sitemap)
- [ ] Implementar RSS feed dinámico
- [ ] Agregar Open Graph tags a `src/views/layouts/base.pug`:
  - `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- [ ] Agregar Twitter Cards
- [ ] Agregar JSON-LD (BlogPosting schema) en `article.pug`
- [ ] Agregar canonical URLs
- [ ] Completar `src/views/partials/seo.pug` (actualmente vacío)

---

## Fase 5 — Email + Newsletter (Semana 5)

- [ ] Crear cuenta en Brevo (o Resend)
- [ ] Configurar API key en `.env`
- [ ] Integrar formulario de contacto → email al admin
- [ ] Integrar newsletter: subscribe → guardar en DB → email de confirmación
- [ ] Template de email de bienvenida para newsletter

---

## Fase 6 — Deploy a Producción (Semana 5-6)

- [ ] Agregar script production en `package.json`:
  - `"start:prod": "NODE_ENV=production node server.js"`
- [ ] Configurar PM2:
  - `npm install -g pm2`
  - Crear `ecosystem.config.js` con `NODE_ENV=production`
- [ ] Configurar Nginx como reverse proxy:
  - `arevdev.com` → `proxy_pass http://localhost:3000`
  - Cache headers + gzip para archivos estáticos
  - Rate limiting por IP
- [ ] Copiar `.env.production` con valores reales al servidor
- [ ] Testear: `curl localhost:3000` → `curl arevdev.com`

---

## Fase 7 — Hardening + Performance (Semana 6-7)

- [ ] `ufw`: permitir solo 22, 80, 443
- [ ] `fail2ban`: configurar para SSH + Nginx
- [ ] Nginx: ocultar versión, limitar request rate por IP
- [ ] Cloudflare WAF: activar reglas básicas de seguridad
- [ ] Minificar CSS en producción: `sass --style=compressed`
- [ ] Minificar JS (si es necesario)
- [ ] `Cache-Control` para assets estáticos (imágenes, CSS, fonts)
- [ ] `font-display: swap` en `@font-face`
- [ ] `loading="lazy"` en imágenes del blog

---

## Fase 8 — Testing + Pulido (Semana 7-8)

- [ ] Recorrer manualmente todas las rutas públicas
- [ ] Probar login, registro, panel admin
- [ ] Probar formulario de contacto (verificar que llega el email)
- [ ] Probar newsletter subscription
- [ ] Lighthouse audit (performance, accesibilidad, SEO, best practices)
- [ ] Verificar responsive (mobile, tablet, desktop)
- [ ] Google Search Console: agregar sitemap, verificar dominio
- [ ] Instalar analytics (Plausible auto-hosteado o Google Analytics 4)
- [ ] Redirección del viejo WordPress → nuevo blog (si aplica)
- [ ] Revisar que no haya console errors ni 404s

---

## Resumen de esfuerzo

| Fase | Días estimados | Dependencias |
|------|---------------|--------------|
| 0. Fundación | 3-4 | Contratar VPS, dominio en Cloudflare |
| 1. Seguridad crítica | 2-3 | Ninguna |
| 2. MySQL + Prisma | 4-5 | Fase 1 |
| 3. Auth + Admin | 4-5 | Fase 2 |
| 4. SEO | 3-4 | Fase 0 (rutas activas para sitemap) |
| 5. Email | 2-3 | Fase 2 (DB para suscriptores) |
| 6. Deploy | 3-4 | Fases 1-5 |
| 7. Hardening | 2-3 | Fase 6 (Nginx configurado) |
| 8. Testing | 3-4 | Todo lo anterior |

**Total estimado: ~26-35 días hábiles (5-7 semanas).**
Guardalo como DEPLOY-PLAN.md en la raíz del proyecto. Cuando quieras que empiece a ejecutar las fases, decime y arrancamos con la Fase 0.
