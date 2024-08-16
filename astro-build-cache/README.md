# `@jcayzac/astro-build-cache`

This module provides a single utility function that computes the SHA-256 digest of a buffer and returns it as a hexadecimal string.

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
import digest from '@jcayzac/utils-digest'

const buffer = new TextEncoder().encode('Hello, World!')
console.log(await digest(buffer))
// dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f
```

## Like it? Buy me a coffee!

If you like anything here, consider buying me a coffee using one of the following platforms:

[GitHub Sponsors](https://github.com/sponsors/jcayzac) ・ [Revolut](https://revolut.me/julienswap) ・ [Wise](https://wise.com/pay/me/julienc375) ・ [Ko-Fi](https://ko-fi.com/jcayzac) ・ [PayPal](https://paypal.me/jcayzac)
