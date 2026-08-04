---
id: welcome-blog
slug: bienvenida-blog
lang: es
translationOf: welcome-blog
title: "Bienvenida al blog de ArevDev"
description: "Primer artículo en español con el modelo de datos unificado del blog."
author: "Matias Arevalo"
date: "2026-05-24"
image: "/images/placeholder.svg"
category: "General"
tags:
  - intro
  - blog
  - desarrollo
draft: false
seoTitle: "Bienvenida al blog ArevDev | Desarrollo web"
seoDescription: "Conocé el nuevo blog en Node.js y Markdown: rápido, bilingüe y pensado para crecer."
comments: false
---

## Introducción

Este es el **primer artículo de prueba** en español. Usa el frontmatter definitivo del proyecto.

### Qué valida este post

- Modelo unificado (`id`, `slug`, `lang`, `translationOf`, `draft`, SEO)
- Render Markdown con sanitización HTML
- Rutas bajo `/es/blog/bienvenida-blog`

### Código de ejemplo

```js
const saludo = (nombre) => `Hola, ${nombre}`;
console.log(saludo('lector'));
```

### Próximos pasos

En las siguientes semanas sumamos SEO avanzado, feeds RSS y el panel de publicación.
