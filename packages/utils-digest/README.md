# `@jcayzac/utils-digest`

This module provides a single utility function that computes the SHA-256 digest of a buffer and returns it as a hexadecimal string.

## Installation

```sh
# pnpm
pnpm add @jcayzac/utils-digest

# bun
bunx add @jcayzac/utils-digest

# npm
npx add @jcayzac/utils-digest

# yarn
yarn add @jcayzac/utils-digest

# deno
deno add npm:@jcayzac/utils-digest
```

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
