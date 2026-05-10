---
link: "dashboard"
title: "Dashboard profesional para gestionar un proyecto Node.js + Express + Pug + Sass"
description: "Objetivo del dashboard"
image: "/images/1.png"
author: "Matias Arevalo"
date: "2026-05-01"
tags: ["intro", "blog"]
---

El dashboard debe funcionar como:

- panel administrativo
- CMS interno
- gestor de contenido
- centro de monitoreo
- sistema de administración

No debe ser solo “una pantalla con cards”.

Debe resolver:

- gestión de artículos
- usuarios
- métricas
- configuración
- medios
- seguridad
- SEO
- automatización

---

# Arquitectura recomendada

```txt
Dashboard
│
├── Layout principal
├── Sidebar
├── Topbar
├── Main Content
├── Widgets
├── Tables
├── Forms
├── Charts
├── Notifications
└── Settings
```

---

# Estructura recomendada

```txt
src/
├── views/
│   └── dashboard/
│       ├── layouts/
│       │   └── admin-layout.pug
│       │
│       ├── partials/
│       │   ├── sidebar.pug
│       │   ├── topbar.pug
│       │   ├── footer.pug
│       │   └── notifications.pug
│       │
│       ├── pages/
│       │   ├── home.pug
│       │   ├── posts.pug
│       │   ├── users.pug
│       │   ├── media.pug
│       │   ├── settings.pug
│       │   ├── analytics.pug
│       │   └── seo.pug
│       │
│       └── components/
│           ├── stat-card.pug
│           ├── chart-card.pug
│           ├── post-table.pug
│           ├── user-table.pug
│           └── form-input.pug
│
├── assets/
│   └── sass/
│       └── dashboard/
│           ├── _sidebar.scss
│           ├── _topbar.scss
│           ├── _widgets.scss
│           ├── _tables.scss
│           ├── _forms.scss
│           ├── _charts.scss
│           └── _dashboard.scss
```

---

# Diseño recomendado

```txt
-------------------------------------------------
| SIDEBAR | TOPBAR                              |
|         |-------------------------------------|
|         | CARDS / STATS                       |
|         |-------------------------------------|
|         | CHARTS                              |
|         |-------------------------------------|
|         | TABLES                              |
-------------------------------------------------
```

---

# Componentes obligatorios

# 1. Sidebar

Debe contener:

- logo
- navegación
- iconos
- logout
- perfil usuario

## Opciones típicas

```txt
Dashboard
Posts
Categorias
Usuarios
Media
SEO
Analytics
Configuración
```

---

# 2. Topbar

Debe tener:

- búsqueda
- notificaciones
- avatar usuario
- accesos rápidos
- modo oscuro

---

# 3. Widgets de estadísticas

Cards pequeñas con:

```txt
Total posts
Usuarios
Visitas
Comentarios
Views
Revenue
Storage
```

Cada widget debe incluir:

- icono
- número
- crecimiento
- color contextual

---

# 4. Tabla de posts

Debe permitir:

- editar
- eliminar
- publicar
- despublicar
- filtrar
- buscar
- paginar

Columnas:

```txt
Imagen
Titulo
Slug
Fecha
Estado
Autor
Acciones
```

---

# 5. Editor de posts

Necesita:

- título
- descripción
- markdown editor
- preview HTML
- tags
- categorías
- imagen destacada
- SEO
- botón publicar

---

# 6. Media manager

Debe permitir:

- subir imágenes
- eliminar
- copiar URL
- drag and drop
- preview
- compresión

---

# 7. Dashboard analytics

Gráficos:

- visitas
- usuarios
- posts populares
- tráfico
- engagement

Librerías recomendadas:

- Chart.js
- ApexCharts
- ECharts

---

# 8. Sistema SEO

Necesita:

- meta title
- meta description
- canonical
- Open Graph
- Twitter Cards
- sitemap
- robots.txt

---

# 9. Gestión de usuarios

Roles:

```txt
Admin
Editor
Author
Visitor
```

Permisos:

- editar
- publicar
- borrar
- administrar

---

# 10. Sistema de autenticación

Necesita:

- login
- logout
- recuperación contraseña
- JWT o session
- CSRF
- rate limit

---

# Dashboard Home recomendado

## Primera fila

```txt
4 stat cards
```

## Segunda fila

```txt
Traffic chart
Popular posts
```

## Tercera fila

```txt
Recent posts table
```

---

# Tecnologías recomendadas

## Frontend

```txt
Pug
Bootstrap
Sass
Chart.js
Bootstrap Icons
```

---

## Backend

```txt
Node.js
Express
```

---

## DB

```txt
PostgreSQL
Prisma
```

---

# Layout base del dashboard

## `admin-layout.pug`

```pug
doctype html
html(lang='es')
    head
        meta(charset='UTF-8')
        meta(name='viewport', content='width=device-width, initial-scale=1.0')

        link(rel='stylesheet', href='/css/main.css')

        title Admin Dashboard

    body.dashboard

        .dashboard-wrapper

            include ../partials/sidebar

            .dashboard-main

                include ../partials/topbar

                main.dashboard-content
                    block content
```

---

# Sidebar ejemplo

## `sidebar.pug`

```pug
aside.sidebar

    .sidebar-logo
        h2 CMS

    nav.sidebar-nav

        ul

            li
                a(href='/admin') Dashboard

            li
                a(href='/admin/posts') Posts

            li
                a(href='/admin/users') Usuarios

            li
                a(href='/admin/media') Media

            li
                a(href='/admin/settings') Configuración
```

---

# Dashboard Home ejemplo

## `home.pug`

```pug
extends ../layouts/admin-layout

block content

    .container-fluid

        .row.g-4.mb-4

            .col-xl-3.col-md-6
                .stat-card
                    h3 120
                    p Posts

            .col-xl-3.col-md-6
                .stat-card
                    h3 3.2K
                    p Visitas

            .col-xl-3.col-md-6
                .stat-card
                    h3 48
                    p Usuarios

            .col-xl-3.col-md-6
                .stat-card
                    h3 98%
                    p Uptime

        .row.g-4

            .col-lg-8

                .chart-card
                    h4 Tráfico

                    canvas#trafficChart

            .col-lg-4

                .popular-posts
                    h4 Posts populares
```

---

# Sass profesional dashboard

## `_dashboard.scss`

```scss
.dashboard {

    background: #f5f7fb;

    min-height: 100vh;
}

.dashboard-wrapper {

    display: flex;
}

.dashboard-main {

    flex: 1;

    margin-left: 280px;
}

.dashboard-content {

    padding: 2rem;
}
```

---

# Sidebar Sass

## `_sidebar.scss`

```scss
.sidebar {

    position: fixed;

    top: 0;

    left: 0;

    width: 280px;

    height: 100vh;

    background: #111827;

    color: white;

    padding: 2rem;

    overflow-y: auto;
}

.sidebar-nav ul {

    list-style: none;

    padding: 0;
}

.sidebar-nav a {

    display: block;

    padding: 1rem;

    border-radius: 12px;

    color: white;

    text-decoration: none;
}

.sidebar-nav a:hover {

    background: rgba(255,255,255,.1);
}
```

---

# Widgets Sass

## `_widgets.scss`

```scss
.stat-card {

    background: white;

    padding: 2rem;

    border-radius: 20px;

    box-shadow: 0 10px 30px rgba(0,0,0,.05);
}

.stat-card h3 {

    font-size: 2.5rem;

    font-weight: 700;
}
```

---

# Funcionalidades futuras importantes

## Sistema de comentarios

- moderación
- spam detection
- replies

---

## Sistema de backups

- export JSON
- export Markdown
- snapshots

---

## Scheduler

- programar posts
- publicaciones automáticas

---

## Notificaciones

- nuevos usuarios
- errores
- publicaciones

---

## Logs

- actividad usuarios
- auditoría
- seguridad

---

# Librerías recomendadas

```txt
Bootstrap Icons
Chart.js
Multer
Prisma
Zod
Helmet
Express-session
Mongoose o Prisma
Marked
DOMPurify
```

---

# Arquitectura recomendada backend

```txt
routes/
controllers/
services/
repositories/
validators/
middlewares/
```

---

# Flujo correcto

```txt
Dashboard UI
   ↓
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
Database
```

---

# Nivel senior real

No construyas todo de una.

Orden recomendado:

```txt
1. Layout admin
2. Sidebar
3. Dashboard home
4. CRUD posts
5. Upload imágenes
6. Markdown editor
7. Auth
8. Analytics
9. SEO
10. Roles y permisos
```

Primero funcionalidad.
Después optimización.
Después escalabilidad.

