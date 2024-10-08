# `@jcayzac/astro-image-service-ng`

> Drop-in replacement for [Astro](https://astro.build/)'s built-in [image service](https://docs.astro.build/en/guides/images/), with support for cropping.

[![license][license-src]][license-href]
[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]

This module gives you a few things not provided by Astro's built-in image service:

- Support for cropping.
- A way to change the default output format to something other than WEBP.
- Persistence through arbitrary stores, not just the Astro build cache.

## Installation

Add `astro-image-service-ng` and `sharp` to your Astro project:

```sh
# pnpm
pnpm add @jcayzac/astro-image-service-ng sharp

# bun
bunx add @jcayzac/astro-image-service-ng sharp

# npm
npx add @jcayzac/astro-image-service-ng sharp

# yarn
yarn add @jcayzac/astro-image-service-ng sharp

# deno
deno add npm:@jcayzac/astro-image-service-ng npm:sharp
```

Then, just add the integration to your [Astro configuration](https://docs.astro.build/guides/configuring-astro/):

```ts
import { defineConfig } from 'astro/config'
import image from '@jcayzac/astro-image-service-ng'

export default defineConfig({
  integrations: [
    image({ /* options */ }),
  ],
  // …other options
})
```

## Features

### Cropping

Astro's built-in image service is great, but **it lacks support for cropping.** When the service receives a transformation request with both the `width` and `height` parameters provided, it ignores the `height` parameter and preserves the aspect ratio of the input image.

This is unfortunate for a number of use cases, including social images —for example for the [Open Graph protocol](https://ogp.me/) or for an [`ImageObject`](https://schema.org/ImageObject) inside [JSON-LD](https://json-ld.org/) embedded in your pages. [Facebook recommends a `40:21` (aka `1.91:1`) aspect ratio](https://developers.facebook.com/docs/sharing/webmasters/images/) for the former while [Google recommends `16:9`, `4:3` and `1:1`](https://developers.google.com/search/docs/appearance/structured-data/article#article-types) for the latter.

Our image service does things differently: when both the `width` and `height` parameters are provided, the result image will have the requested dimensions. You can specify the fitting strategy using the `fit` parameter, which defaults to `cover`. Other values are `contain`, `fill`, `inside` and `outside`. When `contain` is used, bands around the image are filled with the dominant color (for opaque images) or left transparent (for images with an alpha channel). See [here](https://sharp.pixelplumbing.com/api-resize) for more information.

Since this is all using Astro's image service API, you can continue using Astro's `<Image />` component, the `getImage()` function from `astro:assets` or the `_image` API endpoint as usual. Note that you can now use the new `fit` parameter to specify the fitting strategy:

```astro
<Image src="/path/to/image.jpg" width={1200} height={630} fit="cover" />
```

```ts
const img = await getImage('/path/to/image.jpg', { width: 1200, height: 630, fit: 'cover' })
```

```astro
<img src={`/_image?href=http://localhost:4321/path/to/image.jpg&w=1200&h=630&fit=cover`} />
```

> [!NOTE]
> I might implement an alternative band-filling method for the `contain` strategy in the future, where a blurred, low-resolution version of the image fills the background as if `cover` was used before the actual image is drawn on top of it. Yes, you've seen it elsewhere already, and it looks much nicer than a solid color or transparency. Let me know if you'd like that open and **[consider supporting my work!](https://github.com/jcayzac/copepod-modules/tree/main/packages/astro-image-service#like-it-buy-me-a-coffee)**

### Default output format

Astro doesn't let you change the default output format of the image service. It always outputs images in WEBP format, which used to be great but is now becoming obsolete as AVIF compresses much better and is supported in every major browser.

Using this image service, you can change the default image format in the options passed to the integration. The default format is already `avif`, but you can change it back to `webp`, or even use `jpeg` if you prefer.

```ts
import { defineConfig } from 'astro/config'
import image from '@jcayzac/astro-image-service-ng'

export default defineConfig({
  integrations: [
    image({
      // let's get retro!
      defaultFormat: 'jpeg',
    }),
  ],
  // …other options
})
```

### Persistence

When you build your site, Astro's built-in image service generates images on the fly and caches them in the build cache that resides under `node_modules/.astro`. This folder is usually picked up by build pipelines and cached between runs, so that you don't have to rebuild the same variants of your images the next time.

It's great, except when the build cache gets invalidated for whatever reason. This sometimes happens when the build pipeline uses the current branch or the operating system it executes on as a key for the build cache. Invalidating the build cache manually may also be the only way to solve some completely unrelated issues. Lastly, some people like to just wipe out `node_modules` entirely before building something locally, just to make sure they have a _"clean"_ install. All in all, tying your asset cache to your build cache might not be the best strategy for everybody.

And this is just for caching assets on the disk. But what if you want to cache them somewhere else, for instance in some S3 bucket? Or use some of the transform parameters in the file names, so that you know which file represents each variant? This may be useful if you want to migrate out of Astro at some point in the future and want to reuse those images without going through all the transforms again —there's no guarantee the software then will still support specific image transforms you did 10 years before.

This module supports peristence through arbitrary stores by leveraging [`@copepod/kv`](https://www.npmjs.com/package/@copepod/kv), which lets you configure named stores statically. For instance, using the built-in `@copepod/kv/fs-composite` store backend, it's trivial to implement an on-disk persistent store where file names include an image's dimensions:

```ts
// kv.config.ts
import { defineConfig } from '@copepod/kv/types'

export default defineConfig({
  stores: [
    {
      id: 'generated-images',
      use: '@copepod/kv/fs-composite',
      with: {
        path: 'generated',
        pattern: '{name}[{width}x{height}].{__hash}.{format}',
      },
    },
  ],
})

// astro.config.ts
import { defineConfig } from 'astro/config'
import image from '@jcayzac/astro-image-service-ng'

export default defineConfig({
  integrations: [
    image({
      // use whatever kv store is defined for this identifier
      kv: 'generated-images',
    }),
  ],
  // …other options
})
```

`{name}`, `{width}`, etc are interpolators. The image service passes a composite key with the following fields:

```ts
// All the parameters of the resolved transform are included
interface Key extends Omit<ResolvedTransform, 'src'> {
  // The base name of the image, without any extension.
  name: string

  // The source metadata.
  src: sharp.Metadata

  // The format of the image, detected from the source metadata.
  format: string

  // The digest of the entire key, excluding this field.
  digest: string
}
```

> [!TIP]
> Creating and publishing new store backends for `@copepod/kv` is easy —you just need to implement a small interface. [Have a look at the built-in `fs-simple` and `fs-composite` backends here](https://github.com/jcayzac/copepod-modules/tree/main/packages/kv/src) for some example.

## Like it? Buy me a coffee!

If you like anything here, consider buying me a coffee using one of the following platforms:

[![GitHub Sponsors](https://img.shields.io/badge/GitHub%20Sponsors-E30074?logo=github&logoColor=fff&style=for-the-badge)](https://github.com/sponsors/jcayzac) [![Revolut](https://img.shields.io/badge/Revolut-E30074?logo=revolut&logoColor=fff&style=for-the-badge)](https://revolut.me/julienswap) [![Wise](https://img.shields.io/badge/Wise-E30074?logo=wise&logoColor=fff&style=for-the-badge)](https://wise.com/pay/me/julienc375) [![Ko-Fi](https://img.shields.io/badge/Ko--Fi-E30074?logo=kofi&logoColor=fff&style=for-the-badge)](https://ko-fi.com/jcayzac) [![PayPal](https://img.shields.io/badge/PayPal-E30074?logo=paypal&logoColor=fff&style=for-the-badge)](https://paypal.me/jcayzac)

---
[license-src]: https://img.shields.io/github/license/jcayzac/copepod-modules?style=for-the-badge&colorA=18181B&colorB=E30074&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Im0yNDMuMTQgMTMxLjU0bC0zMi04MGExMiAxMiAwIDAgMC0xMy43My03LjI1TDE0MCA1N1Y0MGExMiAxMiAwIDAgMC0yNCAwdjIyLjM3TDUzLjQgNzYuMjlhMTIgMTIgMCAwIDAtOC41NCA3LjI1bC0zMiA3OS45MkExMiAxMiAwIDAgMCAxMiAxNjhjMCAxMi4xMyA2LjIgMjIuNDMgMTcuNDUgMjlBNTUgNTUgMCAwIDAgNTYgMjA0YTU1IDU1IDAgMCAwIDI2LjU1LTdDOTMuOCAxOTAuNDMgMTAwIDE4MC4xMyAxMDAgMTY4YTEyIDEyIDAgMCAwLS44Ni00LjQ2TDcyLjM4IDk2LjY1TDExNiA4N3YxMTdoLTEyYTEyIDEyIDAgMCAwIDAgMjRoNDhhMTIgMTIgMCAwIDAgMC0yNGgtMTJWODEuNjNsNDAuNDItOWwtMjMuNTYgNTguOUExMiAxMiAwIDAgMCAxNTYgMTM2YzAgMTIuMTMgNi4yIDIyLjQzIDE3LjQ1IDI5YTUzLjc4IDUzLjc4IDAgMCAwIDUzLjEgMGMxMS4yNS02LjU3IDE3LjQ1LTE2Ljg3IDE3LjQ1LTI5YTEyIDEyIDAgMCAwLS44Ni00LjQ2TTU2IDE4MGMtMy43MSAwLTE4LTEuODctMTkuODEtMTAuMThMNTYgMTIwLjMxbDE5LjgxIDQ5LjUxQzc0IDE3OC4xMyA1OS43MSAxODAgNTYgMTgwbTE0NC0zMmMtMy43MSAwLTE4LTEuODctMTkuODEtMTAuMThMMjAwIDg4LjMxbDE5LjgxIDQ5LjUxQzIxOCAxNDYuMTMgMjAzLjcxIDE0OCAyMDAgMTQ4Ii8+PC9zdmc+
[license-href]: https://github.com/jcayzac/copepod-modules/blob/main/LICENSE
[npm-version-src]: https://img.shields.io/npm/v/@jcayzac/astro-image-service-ng?logo=npm&style=for-the-badge&colorA=18181B&colorB=E30074
[npm-version-href]: https://npmjs.com/package/@jcayzac/astro-image-service-ng
[npm-downloads-src]: https://img.shields.io/npm/dm/@jcayzac/astro-image-service-ng?style=for-the-badge&colorA=18181B&colorB=E30074&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Im0yMjkuNjYgMTQxLjY2bC05NiA5NmE4IDggMCAwIDEtMTEuMzIgMGwtOTYtOTZBOCA4IDAgMCAxIDMyIDEyOGg0MFY0OGExNiAxNiAwIDAgMSAxNi0xNmg4MGExNiAxNiAwIDAgMSAxNiAxNnY4MGg0MGE4IDggMCAwIDEgNS42NiAxMy42NiIvPjwvc3ZnPg==
[npm-downloads-href]: https://npmjs.com/package/@jcayzac/astro-image-service-ng
[bundle-src]: https://img.shields.io/bundlephobia/min/@jcayzac/astro-image-service-ng?style=for-the-badge&colorA=18181B&colorB=E30074&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0yNDAgMTUydjI0YTE2IDE2IDAgMCAxLTE2IDE2SDExNS45M2E0IDQgMCAwIDEtMy4yNC02LjM1TDE3NC4yNyAxMDFhOC4yMSA4LjIxIDAgMCAwLTEuMzctMTEuM2E4IDggMCAwIDAtMTEuMzcgMS42MWwtNzIgOTkuMDZhNCA0IDAgMCAxLTMuMjggMS42M0gzMmExNiAxNiAwIDAgMS0xNi0xNnYtMjIuODdjMC0xLjc5IDAtMy41Ny4xMy01LjMzYTQgNCAwIDAgMSA0LTMuOEg0OGE4IDggMCAwIDAgOC04LjUzYTguMTcgOC4xNyAwIDAgMC04LjI3LTcuNDdIMjMuOTJhNCA0IDAgMCAxLTMuODctNWMxMi00My44NCA0OS42Ni03Ny4xMyA5NS41Mi04Mi4yOGE0IDQgMCAwIDEgNC40MyA0VjcyYTggOCAwIDAgMCA4LjUzIDhhOC4xNyA4LjE3IDAgMCAwIDcuNDctOC4yN1Y0NC42N2E0IDQgMCAwIDEgNC40My00YTExMi4xOCAxMTIuMTggMCAwIDEgOTUuOCA4Mi4zM2E0IDQgMCAwIDEtMy44OCA1aC0yNC4wOGE4LjE3IDguMTcgMCAwIDAtOC4yNSA3LjQ3YTggOCAwIDAgMCA4IDguNTNoMjcuOTJhNCA0IDAgMCAxIDQgMy44NmMuMDYgMS4zNy4wNiAyLjc1LjA2IDQuMTQiLz48L3N2Zz4=
[bundle-href]: https://bundlephobia.com/result?p=@jcayzac/astro-image-service-ng
