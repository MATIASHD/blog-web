---
id: markdown-showcase
slug: full-markdown-guide
lang: en
translationOf: markdown-showcase
title: "Visual guide: every Markdown resource to test the blog"
description: "Reference article with headings, lists, tables, code, quotes, multimedia, safe HTML, and more."
author: "Matias Arevalo"
date: "2026-05-26"
image: "1.png"
category: "Web Development"
tags:
  - markdown
  - testing
  - documentation
  - accessibility
draft: false
seoTitle: "Full Markdown guide for testing | ArevDev"
seoDescription: "Test post covering Markdown syntax supported by the blog: typography, lists, tables, code, and embeds."
comments: true
---

This article exists to **stress-test the reading view** of the blog. Each section demonstrates a different Markdown feature (and allowed HTML) so you can validate styles, responsive layout, and sanitization.

---

## Table of contents

1. [Headings](#headings)
2. [Typography](#typography)
3. [Lists](#lists)
4. [Quotes and rules](#quotes-and-rules)
5. [Code](#code)
6. [Tables](#tables)
7. [Links and images](#links-and-images)
8. [Multimedia](#multimedia)
9. [Safe HTML](#safe-html)
10. [Final checklist](#final-checklist)

---

## Headings

# Heading H1 (content-only test)

## Heading H2

### Heading H3

#### Heading H4

##### Heading H5

###### Heading H6

---

## Typography

Normal text with **bold**, *italic*, ***bold italic***, ~~strikethrough~~, and `inline code`.

You can mix [internal links](#typography) with [external links](https://www.markdownguide.org/).

Subscript H~2~O and superscript E = mc^2^ (extension syntax; may be ignored by the parser).

---

## Lists

### Unordered list

- First item
- Second item
  - Nested sub-item
  - Another sub-item
- Third item

### Ordered list

1. Define frontmatter
2. Write the body in Markdown
3. Publish with `draft: false`
4. Review at `/en/blog/full-markdown-guide`

### Task list (GFM)

- [x] Unified post model
- [x] Bilingual routes `/es` and `/en`
- [ ] Admin panel (next phase)
- [ ] Automatic RSS and sitemap

---

## Quotes and rules

> Simple blockquote.
>
> It can span **multiple lines** and include links such as [ArevDev](https://arevdev.com).

Nested quote:

> Level 1
>
> > Level 2 — useful for margin notes.

Horizontal rule:

---

Alternative rule with asterisks:

***

---

## Code

### JavaScript

```javascript
const posts = await fetch('/api/posts?lang=en').then((r) => r.json());

function excerpt(text, max = 120) {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
```

### Bash

```bash
npm run sass
npm start
curl -s http://localhost:3001/en/blog/full-markdown-guide
```

### JSON (mental frontmatter model)

```json
{
  "id": "markdown-showcase",
  "slug": "full-markdown-guide",
  "lang": "en",
  "draft": false
}
```

### Plain fence

```
┌─────────────────────────────┐
│  Article preview            │
└─────────────────────────────┘
```

---

## Tables

| Syntax          | Rendered | Notes              |
|-----------------|----------|--------------------|
| `**bold**`      | **bold** | Strong emphasis    |
| `*italic*`      | *italic* | Soft emphasis      |
| `` `code` ``     | `code`   | Monospace          |
| `[link](url)`   | link     | Internal/external  |

Alignment sample:

| Left      | Center | Right   |
|:----------|:------:|--------:|
| cell A    | cell B | cell C  |
| data 1    | data 2 | data 3  |

---

## Links and images

Remote image with caption (blog renderer):

![Laptop showing code on screen](https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=600&fit=crop "Web development — Unsplash / Chris Ried")

Local reference image (if present in `public`):

![Local placeholder](/images/placeholder.svg "Local SVG test")

---

## Multimedia

### Embedded video (YouTube)

<div class="ratio ratio-16x9 mb-4">
  <iframe
    src="https://www.youtube.com/embed/5i5A2vqSZ5M"
    title="Markdown crash course"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</div>

Direct link if the iframe fails: [watch on YouTube](https://www.youtube.com/watch?v=5i5A2vqSZ5M).

---

## Safe HTML

The pipeline allows limited HTML after sanitization. Useful test cases:

<mark>Highlighted text with mark</mark>

<del>Deleted text</del> and <ins>inserted text</ins>

Combination: <kbd>Ctrl</kbd> + <kbd>S</kbd> to save (simulated).

---

## Details block

<details>
<summary>What does this block validate?</summary>

If your engine does not support `<details>`, you will see raw HTML or it will be stripped. Good for discovering parser limits.

</details>

---

## Final checklist

Use this list while reviewing mobile and desktop views:

1. Do headings show a clear visual hierarchy?
2. Do tables scroll horizontally without breaking layout?
3. Does code use a background and monospace font?
4. Do remote images load with `loading="lazy"`?
5. Does the video keep a 16:9 ratio?
6. Do language menu links point to the correct translation?

**Expected outcome:** if everything feels readable and balanced (Medium-style), the Markdown system is ready for real content.

---

*Test article — ArevDev Blog. Images: [Unsplash](https://unsplash.com).*
