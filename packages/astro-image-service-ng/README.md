# `@jcayzac/astro-image-service-ng`

Drop-in replacement for [Astro](https://astro.build/)'s built-in [image service](https://docs.astro.build/en/guides/images/), with support for cropping.

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

[GitHub Sponsors](https://github.com/sponsors/jcayzac) ・ [Revolut](https://revolut.me/julienswap) ・ [Wise](https://wise.com/pay/me/julienc375) ・ [Ko-Fi](https://ko-fi.com/jcayzac) ・ [PayPal](https://paypal.me/jcayzac)
