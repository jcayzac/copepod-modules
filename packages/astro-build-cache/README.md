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

```sh
# pnpm
pnpm add @jcayzac/astro-build-cache

# bun
bunx add @jcayzac/astro-build-cache

# npm
npx add @jcayzac/astro-build-cache

# yarn
yarn add @jcayzac/astro-build-cache

# deno
deno add npm:@jcayzac/astro-build-cache
```

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

> [!TIP]
> To avoid any build error when using this module, you should add it to the list of externalized packages:
>
> ```ts
> // astro.config.mjs
> export default defineConfig({
>   /* ...other options... */
>   vite: {
>     build: {
>       rollupOptions: {
>         external: [
>           '@jcayzac/astro-build-cache',
>         ],
>       },
>     }
>   },
> })
> ```

## Like it? Buy me a coffee!

If you like anything here, consider buying me a coffee using one of the following platforms:

[![GitHub Sponsors](https://img.shields.io/badge/GitHub%20Sponsors-E30074?logo=github&logoColor=fff&style=for-the-badge)](https://github.com/sponsors/jcayzac) [![Revolut](https://img.shields.io/badge/Revolut-E30074?logo=revolut&logoColor=fff&style=for-the-badge)](https://revolut.me/julienswap) [![Wise](https://img.shields.io/badge/Wise-E30074?logo=wise&logoColor=fff&style=for-the-badge)](https://wise.com/pay/me/julienc375) [![Ko-Fi](https://img.shields.io/badge/Ko--Fi-E30074?logo=kofi&logoColor=fff&style=for-the-badge)](https://ko-fi.com/jcayzac) [![PayPal](https://img.shields.io/badge/PayPal-E30074?logo=paypal&logoColor=fff&style=for-the-badge)](https://paypal.me/jcayzac)