# `@jcayzac/utils-digest`

This module provides a single utility function that computes the SHA-256 digest of a buffer and returns it as a hexadecimal string.

## Installation

This module is published on the [JSR registry](https://jsr.io/). To install it, run:

```sh
# deno
deno add @jcayzac/utils-digest

# pnpm
pnpm dlx jsr add @jcayzac/utils-digest

# bun
bunx jsr add @jcayzac/utils-digest

# npm
npx jsr add @jcayzac/utils-digest

# yarn
yarn dlx jsr add @jcayzac/utils-digest
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

If you like this module, consider buying me a coffee using one of the following methods:

- [GitHub](https://github.com/sponsors/jcayzac)
- [Ko-Fi](https://ko-fi.com/jcayzac)
- Revolut: `@julienswap`
- Wise: `@julienc375`
