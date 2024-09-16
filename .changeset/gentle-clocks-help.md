---
"@copepod/unified-plugins": minor
---

Small fixes and features for `codepen` links:

* The `iframe` was missing the `allowfullscreen` and `allowtransparency` attributes.
* In addition to _"regular"_ pen URLs, the plugin now also accepts embed URLs.
* It is now possible to pass embed parameters (e.g. `default-tab`) directly in the URL, as query parameters.
