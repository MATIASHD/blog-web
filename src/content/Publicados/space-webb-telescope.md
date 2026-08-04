---
id: space-webb-article
slug: space-webb-telescope
lang: en
translationOf: space-webb-article
title: "Why the Webb telescope changed the way I look at the sky"
description: "A short tour of modern astronomy, with a real deep-space photo and an embedded video to understand what we are observing."
author: "Matias Arevalo"
date: "2026-05-25"
image: "2.png"
category: "Science"
tags:
  - astronomy
  - space
  - science
draft: false
seoTitle: "Webb telescope and space exploration | ArevDev"
seoDescription: "Test article about astronomy with an Unsplash photo and embedded YouTube video."
comments: false
---

Astronomy has always felt like the most honest way to travel: no suitcase, just curiosity and patience. When the **James Webb Space Telescope (JWST)** released its first images, I felt the same spark as when you discover a programming language that finally structures messy ideas.

## A glimpse into the early universe

Webb does not replace Hubble — it complements it. It mainly observes in **infrared**, which lets us see very distant galaxies whose light has been stretched by cosmic expansion. In practice, we look back in time.

![Star field and nebula photographed from Earth orbit](https://images.unsplash.com/photo-1419242902214-272bada7a7b3?w=1200&h=700&fit=crop "Night sky photography — Unsplash / Greg Rakozy")

> Science does not always advance with explosions. Sometimes it advances with photons that took millions of years to reach us.

## Three ideas that stayed with me

1. **Scale**: a distant galaxy may look like a smudge; it can still contain billions of stars.
2. **Engineering**: deploying a 6.5-meter mirror in space is a feat of software, materials, and global coordination.
3. **Humility**: every new image adjusts models we thought were almost settled.

### Quick comparison

| Telescope | Main wavelength band | Launch year |
|-----------|----------------------|-------------|
| Hubble    | Visible / ultraviolet | 1990       |
| Webb      | Infrared             | 2021        |

## Recommended video

This NASA overview explains the mission goals in a few minutes:

<div class="ratio ratio-16x9 mb-4">
  <iframe
    src="https://www.youtube.com/embed/9x6KUXGXZDo"
    title="NASA: first images from the James Webb Space Telescope"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</div>

If the player does not load, watch the video on [YouTube](https://www.youtube.com/watch?v=9x6KUXGXZDo).

## Code I use to remember distances

When I take technical notes, I convert light-years to kilometers with a simple constant:

```js
const LIGHT_YEAR_KM = 9.461e12;

function lightYearsToKm(lightYears) {
  return lightYears * LIGHT_YEAR_KM;
}

console.log(lightYearsToKm(13.4)); // rough distance to some early galaxies
```

## Closing thoughts

You do not need to be an astronomer to enjoy this data. One image, one question — *what am I actually seeing?* — and you are already learning. That is why I picked this topic as a visual test article for the blog.

---

*Cover image: [Unsplash](https://unsplash.com/photos/blue-universe-1462331940025). Inline photo: [Unsplash / Greg Rakozy](https://unsplash.com/photos/photo-1419242902214).*
