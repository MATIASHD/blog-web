---
id: markdown-showcase
slug: guia-markdown-completa
lang: es
translationOf: markdown-showcase
title: "Guía visual: todos los recursos Markdown para probar el blog"
description: "Artículo de referencia con encabezados, listas, tablas, código, citas, multimedia, HTML seguro y más."
author: "Matias Arevalo"
date: "2026-05-26"
image: "https://images.unsplash.com/photo-1517694712202-8dd79c70a870?w=1200&h=630&fit=crop"
category: "Desarrollo Web"
tags:
  - markdown
  - testing
  - documentacion
  - accesibilidad
draft: false
seoTitle: "Guía Markdown completa para testing | ArevDev"
seoDescription: "Post de prueba que recorre la sintaxis Markdown soportada por el blog: tipografía, listas, tablas, código y embeds."
comments: true
---

Este artículo existe para **probar la vista de lectura** del blog. Cada sección muestra un recurso distinto de Markdown (y HTML permitido) para que puedas validar estilos, responsive y sanitización.

---

## Tabla de contenidos

1. [Encabezados](#encabezados)
2. [Tipografía](#tipografía)
3. [Listas](#listas)
4. [Citas y reglas](#citas-y-reglas)
5. [Código](#código)
6. [Tablas](#tablas)
7. [Enlaces e imágenes](#enlaces-e-imágenes)
8. [Multimedia](#multimedia)
9. [HTML seguro](#html-seguro)
10. [Checklist final](#checklist-final)

---

## Encabezados

# Heading H1 (solo para prueba dentro del contenido)

## Heading H2

### Heading H3

#### Heading H4

##### Heading H5

###### Heading H6

---

## Tipografía

Texto normal con **negrita**, *cursiva*, ***negrita y cursiva***, ~~tachado~~ y `código inline`.

También podés combinar [enlaces internos](#tipografía) con [enlaces externos](https://www.markdownguide.org/) que abren en la misma pestaña.

Subíndice H~2~O y superíndice E = mc^2^ (sintaxis extensiones; si no renderiza, el motor puede ignorarlo).

---

## Listas

### Lista desordenada

- Primer ítem
- Segundo ítem
  - Sub-ítem anidado
  - Otro sub-ítem
- Tercer ítem

### Lista ordenada

1. Definir frontmatter
2. Escribir cuerpo en Markdown
3. Publicar con `draft: false`
4. Revisar en `/es/blog/guia-markdown-completa`

### Lista de tareas (GFM)

- [x] Modelo de post unificado
- [x] Rutas bilingües `/es` y `/en`
- [ ] Panel admin (próxima fase)
- [ ] RSS y sitemap automático

---

## Citas y reglas

> Bloque de cita simple.
>
> Puede tener **varias líneas** y enlaces como [ArevDev](https://arevdev.com).

Cita anidada:

> Nivel 1
>
> > Nivel 2 — útil para notas al margen.

Separador horizontal:

---

Otro separador con asteriscos:

***

---

## Código

### JavaScript

```javascript
const posts = await fetch('/api/posts?lang=es').then((r) => r.json());

function excerpt(text, max = 120) {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
```

### Bash

```bash
npm run sass
npm start
curl -s http://localhost:3001/es/blog/guia-markdown-completa
```

### JSON (frontmatter mental model)

```json
{
  "id": "markdown-showcase",
  "slug": "guia-markdown-completa",
  "lang": "es",
  "draft": false
}
```

### Bloque sin lenguaje

```
┌─────────────────────────────┐
│  Vista previa del artículo  │
└─────────────────────────────┘
```

---

## Tablas

| Sintaxis        | Renderizado | Notas                    |
|-----------------|-------------|--------------------------|
| `**bold**`      | **bold**    | Énfasis fuerte           |
| `*italic*`      | *italic*    | Énfasis suave            |
| `` `code` ``     | `code`      | Monoespaciado            |
| `[link](url)`   | enlace      | Interno o externo        |

Alineación (según soporte del motor):

| Izquierda | Centro | Derecha |
|:----------|:------:|--------:|
| celda A   | celda B | celda C |
| dato 1    | dato 2  | dato 3  |

---

## Enlaces e imágenes

Imagen remota con pie de foto (renderer del blog):

![Laptop con código en pantalla](https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=600&fit=crop "Desarrollo web — Unsplash / Chris Ried")

Imagen de referencia local (si existe en `public`):

![Placeholder local](/images/placeholder.svg "SVG de prueba local")

---

## Multimedia

### Video embebido (YouTube)

<div class="ratio ratio-16x9 mb-4">
  <iframe
    src="https://www.youtube.com/embed/5i5A2vqSZ5M"
    title="Markdown crash course (inglés, referencia útil)"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</div>

Enlace directo por si el iframe no carga: [ver en YouTube](https://www.youtube.com/watch?v=5i5A2vqSZ5M).

---

## HTML seguro

El pipeline permite HTML limitado tras sanitizar. Ejemplos útiles para testing:

<mark>Texto resaltado con mark</mark>

<del>Texto eliminado</del> y <ins>texto insertado</ins>

Combinación: <kbd>Ctrl</kbd> + <kbd>S</kbd> para guardar (simulado).

---

## Detalles y definiciones

<details>
<summary>¿Qué valida este bloque?</summary>

Si tu motor no soporta `<details>`, verás HTML crudo o lo filtrará el sanitizador. Sirve para detectar límites del parser.

</details>

---

## Checklist final

Usá esta lista mientras revisás la vista en móvil y desktop:

1. ¿Los encabezados tienen jerarquía visual clara?
2. ¿Las tablas hacen scroll horizontal sin romper el layout?
3. ¿El código tiene fondo y fuente monoespaciada?
4. ¿Las imágenes remotas cargan con `loading="lazy"`?
5. ¿El video respeta relación 16:9?
6. ¿Los enlaces del menú de idioma llevan a la traducción correcta?

**Resultado esperado:** si todo se ve legible y equilibrado (estilo Medium), el sistema Markdown está listo para contenido real.

---

*Artículo de prueba — ArevDev Blog. Imágenes: [Unsplash](https://unsplash.com).*
