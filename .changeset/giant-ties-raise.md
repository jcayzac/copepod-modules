---
"@jcayzac/astro-image-service-ng": patch
---

Bogus transformations were applied to the code during bundling. Disabling minification of the library when built by `tsup` seems to improve things.
