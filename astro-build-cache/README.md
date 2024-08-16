# `@jcayzac/astro-build-cache`

This module provides a simple build cache for artifacts you may be generating during an [Astro](https://astro.build/) build.

As with Astro's own build artifacts, the cache is stored under `node_modules/.astro` where it can be easily ignored by version control systems and cached by cloud providers.

```sh
$ ls -1 node_modules/.astro/
assets
build-cache.development     # dev cache
build-cache.development-shm
build-cache.development-wal
build-cache.production      # prod cache
build-cache.production-shm
build-cache.production-wal
bundle
chunks
content
data-store.json
```

To clear the cache, simply delete `node_modules/.astro/build-cache.*`.

## Installation

This module is published on the [JSR registry](https://jsr.io/). To install it, run:

```sh
# deno
deno add @jcayzac/astro-build-cache

# pnpm
pnpm dlx jsr add @jcayzac/astro-build-cache

# bun
bunx jsr add @jcayzac/astro-build-cache

# npm
npx jsr add @jcayzac/astro-build-cache

# yarn
yarn dlx jsr add @jcayzac/astro-build-cache
```

For more information, see the [JSR documentation](https://jsr.io/docs/using-packages).

## Usage

```ts
import { Cache } from '@jcayzac/astro-build-cache'

// Create a cache instance. Name is optional. Values are scoped by name.
const { cached } = new Cache('name')

// Now you can get values, with cache support, from anywhere.
const value = cached<Uint8Array>(
  // keyable material
  {
    format: 'png',
    options,
    fonts,
    element: serializeJsx(node),
  },
  // generator
  async () =>
  new Resvg(
    (await satori(node, options)),
    {
      fitTo: {
          mode: 'width',
          value: options.width,
      },
    },
  )
    .render()
    .asPng(),
)
```

## Like it? Buy me a coffee!

If you like anything here, consider buying me a coffee using one of the following platforms:

[GitHub Sponsors](https://github.com/sponsors/jcayzac) ・ [Revolut](https://revolut.me/julienswap) ・ [Wise](https://wise.com/pay/me/julienc375) ・ [Ko-Fi](https://ko-fi.com/jcayzac) ・ [PayPal](https://paypal.me/jcayzac)
