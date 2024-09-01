---
"@jcayzac/astro-image-service-ng": minor
---

- SVG images are optimized with `svgo`.
- Using a quality of `"max"` or `100` will request lossless transforms for formats that support it (`webp` and `avif`).
- `width` and `height` are now automatically inferred in most cases.
- The image service doesn't depend on the Astro built-in image service anymore.
