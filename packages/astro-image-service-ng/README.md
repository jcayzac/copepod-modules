# `@jcayzac/astro-image-service-ng`

> Drop-in replacement for [Astro](https://astro.build/)'s built-in [image service](https://docs.astro.build/en/guides/images/), with support for cropping.

[![license][license-src]][license-href]
[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]

## Motivation

Astro's built-in image service is great, but it lacks support for cropping. When the service receives a transformation request with both the `width` and `height` parameters provided, it ignores the `height` parameter and preserves the aspect ratio of the input image.

The image service provided by this package do things differently: when both the `width` and `height` parameters are provided, the image is first cropped to match the new image aspect ratio, then resized to the requested dimensions while maintaining the original pixel aspect ratio. This is similar to what [`object-fit: cover`](https://developer.mozilla.org/docs/Web/CSS/object-fit#cover) does in CSS.

This lets you crop images to specific aspect ratios, a very crude form of [art direction](https://mariohernandez.io/blog/art-direction-using-the-picture-html-element/) useful in various scenarios, for example:

- When you use media queries in a `<picture>` element to serve different images based on the viewport size, and you're OK with dropping all but the center of the image on very small viewports.
- When generating social images, for example for the [Open Graph protocol](https://ogp.me/) or for an [`ImageObject`](https://schema.org/ImageObject) inside [JSON-LD](https://json-ld.org/) embedded in your pages. [Facebook recommends a `40:21` (aka `1.91:1`) aspect ratio](https://developers.facebook.com/docs/sharing/webmasters/images/) for the former while [Google recommends `16:9`, `4:3` and `1:1`](https://developers.google.com/search/docs/appearance/structured-data/article#article-types) for the latter.

> [!NOTE]
> I am considering adding support for more art direction in some upcoming release.
>
> I think the ability to specify the cropping strategy and the focal point of the image would be the bare minimum.
>
> Some composition API where you can add e.g. an author avatar or a website logo somewhere, and add some text on top of the image, would be nice too.
>
> Right now it mostly depends on what I need for my own projects. If you want these features sooner, **[consider supporting me!](https://github.com/jcayzac/copepod-modules/tree/main/packages/astro-image-service#like-it-buy-me-a-coffee)**

## Installation

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

## Usage

1. In your Astro project, replace the built-in image service with this one in your [configuration file](https://docs.astro.build/guides/configuring-astro/):

   ```ts
   import { defineConfig } from 'astro/config'

   export default defineConfig({
     image: {
       service: {
         entrypoint: '@jcayzac/astro-image-service-ng',
       },
     },
     // …other options
   })
   ```

2. Use Astro's `<Image />` component, the `getImage()` function from `astro:assets` or the `_image` API endpoint as usual.

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
