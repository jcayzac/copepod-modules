---
"@jcayzac/astro-rehype-frontmatter-reading-stats": minor
---

This version exports a new `FrontmatterReadingStats` type so that you can get the correct types for `readingTime` and `wordCount` (both `number`) instead of `any`. Just change your code like this:

```patch
- const { wordCount, readingTime } = remarkPluginFrontmatter;
+ const { wordCount, readingTime } = remarkPluginFrontmatter as FrontmatterReadingStats;
```
