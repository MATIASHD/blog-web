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
