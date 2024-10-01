# @jcayzac/astro-image-service-ng

## 0.3.0-dev.1

### Patch Changes

- Updated dependencies [[`97cfe91`](https://github.com/jcayzac/copepod-modules/commit/97cfe91f22898cb5b2031f93506d595e7b5524fb)]:
  - @copepod/kv@0.0.1-dev.5

## 0.3.0-dev.0

### Minor Changes

- [#109](https://github.com/jcayzac/copepod-modules/pull/109) [`e1ca2a4`](https://github.com/jcayzac/copepod-modules/commit/e1ca2a4f7e95fa73895935135bb2180d05dce1b1) Thanks [@jcayzac](https://github.com/jcayzac)! - Integrate with @copepod/kv.

### Patch Changes

- Updated dependencies [[`e1ca2a4`](https://github.com/jcayzac/copepod-modules/commit/e1ca2a4f7e95fa73895935135bb2180d05dce1b1)]:
  - @copepod/kv@0.0.1-dev.4

## 0.2.4

### Patch Changes

- [#65](https://github.com/jcayzac/copepod-modules/pull/65) [`c7a74bb`](https://github.com/jcayzac/copepod-modules/commit/c7a74bbd71c022fdc118277161c68939966213b2) Thanks [@jcayzac](https://github.com/jcayzac)! - Fix broken links in `package.json`.

## 0.2.3

### Patch Changes

- [#59](https://github.com/jcayzac/copepod-modules/pull/59) [`4b5fe12`](https://github.com/jcayzac/copepod-modules/commit/4b5fe1218f3862c4a8711c5f923a33573002b5f9) Thanks [@jcayzac](https://github.com/jcayzac)! - Fix image dimension bug when width and height were not provided.

## 0.2.2

### Patch Changes

- [#56](https://github.com/jcayzac/copepod-modules/pull/56) [`e9a190f`](https://github.com/jcayzac/copepod-modules/commit/e9a190fc9174d617a7c048aa3b7042770a7279b1) Thanks [@jcayzac](https://github.com/jcayzac)! - Updated dependencies.

## 0.2.1

### Patch Changes

- Updated dependencies [[`3c66bd1`](https://github.com/jcayzac/copepod-modules/commit/3c66bd149c5d74a9b12dd14d6acf210a6eb66cd9)]:
  - @jcayzac/image-information@1.1.1

## 0.2.0

### Minor Changes

- [#49](https://github.com/jcayzac/copepod-modules/pull/49) [`6f7f0da`](https://github.com/jcayzac/copepod-modules/commit/6f7f0da862cc8993d00e8cb9b7a1047e795bb3b9) Thanks [@jcayzac](https://github.com/jcayzac)! - - SVG images are optimized with `svgo`.
  - Using a quality of `"max"` or `100` will request lossless transforms for formats that support it (`webp` and `avif`).
  - `width` and `height` are now automatically inferred in most cases.
  - The image service doesn't depend on the Astro built-in image service anymore.

## 0.0.7

### Patch Changes

- [#42](https://github.com/jcayzac/copepod-modules/pull/42) [`03c8f64`](https://github.com/jcayzac/copepod-modules/commit/03c8f64c9ffd271cc6b8ea0f57b4caba1634eba5) Thanks [@jcayzac](https://github.com/jcayzac)! - Fix `getHTMLAttributes()` returning invalid data.

- [#44](https://github.com/jcayzac/copepod-modules/pull/44) [`c903092`](https://github.com/jcayzac/copepod-modules/commit/c903092b496cac12a8af4df92c8cb22988531492) Thanks [@jcayzac](https://github.com/jcayzac)! - Add `logger` option.

## 0.0.6

### Patch Changes

- [`7b28c42`](https://github.com/jcayzac/copepod-modules/commit/7b28c42fbf6a7e8d229df1f4efb03985418ca5d0) Thanks [@jcayzac](https://github.com/jcayzac)! - Bogus transformations were applied to the code during bundling. Disabling minification of the library when built by `tsup` seems to improve things.

## 0.0.5

### Patch Changes

- [#38](https://github.com/jcayzac/copepod-modules/pull/38) [`184c529`](https://github.com/jcayzac/copepod-modules/commit/184c529689c09a6671130460ed8af05c2a8bf136) Thanks [@jcayzac](https://github.com/jcayzac)! - fix broken results of 0.0.4

## 0.0.4

### Patch Changes

- [#36](https://github.com/jcayzac/copepod-modules/pull/36) [`6ad336b`](https://github.com/jcayzac/copepod-modules/commit/6ad336bfddf176e23bbd40643875142296064bce) Thanks [@jcayzac](https://github.com/jcayzac)! - add more debug logs around image service

## 0.0.3

### Patch Changes

- [#32](https://github.com/jcayzac/copepod-modules/pull/32) [`eeabd51`](https://github.com/jcayzac/copepod-modules/commit/eeabd51b7919b0070e1f5196a2a04f469e134fd2) Thanks [@jcayzac](https://github.com/jcayzac)! - Use stricter tsconfig during build.

## 0.0.2

### Patch Changes

- [#30](https://github.com/jcayzac/copepod-modules/pull/30) [`62cd787`](https://github.com/jcayzac/copepod-modules/commit/62cd787cc00cadaa126199a6cbe8c6c06907727b) Thanks [@jcayzac](https://github.com/jcayzac)! - Bumped dependencies.

## 0.0.1

### Patch Changes

- [#28](https://github.com/jcayzac/copepod-modules/pull/28) [`cb9ea6a`](https://github.com/jcayzac/copepod-modules/commit/cb9ea6ad4137c55e81c649b0580da209f5f51ba3) Thanks [@jcayzac](https://github.com/jcayzac)! - updated badges
