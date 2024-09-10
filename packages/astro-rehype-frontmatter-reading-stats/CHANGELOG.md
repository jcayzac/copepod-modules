# @jcayzac/astro-rehype-frontmatter-reading-stats

## 0.1.0

### Minor Changes

- [#67](https://github.com/jcayzac/copepod-modules/pull/67) [`6ba3bd9`](https://github.com/jcayzac/copepod-modules/commit/6ba3bd960159e7d5e40f53795d5c394d7351bd0f) Thanks [@jcayzac](https://github.com/jcayzac)! - This version exports a new `FrontmatterReadingStats` type so that you can get the correct types for `readingTime` and `wordCount` (both `number`) instead of `any`. Just change your code like this:

  ```patch
  - const { wordCount, readingTime } = remarkPluginFrontmatter;
  + const { wordCount, readingTime } = remarkPluginFrontmatter as FrontmatterReadingStats;
  ```

## 0.0.5

### Patch Changes

- [#55](https://github.com/jcayzac/copepod-modules/pull/55) [`15e9074`](https://github.com/jcayzac/copepod-modules/commit/15e90749018eca4596b70b4f17b79393ca3a5dde) Thanks [@jcayzac](https://github.com/jcayzac)! - Updated documentation

## 0.0.4

### Patch Changes

- [#28](https://github.com/jcayzac/copepod-modules/pull/28) [`cb9ea6a`](https://github.com/jcayzac/copepod-modules/commit/cb9ea6ad4137c55e81c649b0580da209f5f51ba3) Thanks [@jcayzac](https://github.com/jcayzac)! - updated badges
