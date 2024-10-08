---
"@jcayzac/astro-image-service-ng": minor
---

`"fit"` should now work as expected. In addition, if `"contain"` is used, I now use the dominant color (or transparent of the image has an transparent pixels) for the bands around the image, rather than the default black used by Sharp.
Because it requires calling `Sharp.stats()` and it's very expensive, resizing is now deferred so nothing gets done until the kv store is checked first.
