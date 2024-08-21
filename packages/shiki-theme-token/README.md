# `@jcayzac/shiki-theme-token`

> Unstyled theme for Shiki

[![license][license-src]][license-href]
[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]

This is a special theme for [Shiki](https://shiki.style) to use together with [`@jcayzac/shiki-transformer-token`](https://www.npmjs.com/package/@jcayzac/shiki-transformer-token).

> [!WARNING]
> Used alone, this theme is non-functional, as it replaces color values with grammar token names and will generate invalid CSS. It **MUST** be used together with the transformer.

## Motivation

Shiki is great, but it can be daunting to create a new theme from scratch, or even just to customize an existing one.

Sure, you can use the experimental [CSS Variables Theme](https://shiki.style/guide/theme-colors#css-variables-theme), which lets you specify a color palette using CSS variables. But that theme uses a very reduced grammar, internally, so the result is not as good as the built-in themes.

This theme gives up on styling completely, and instead replaces color values with grammar token names, which [`@jcayzac/shiki-transformer-token`](https://www.npmjs.com/package/@jcayzac/shiki-transformer-token) then transforms into `[data-token]` attributes in the produced HTML.

This gives you complete flexibility on how to style your code, not limited to the CSS variables that Shiki supports, nor just to colors either.

## Installation

```sh
# pnpm
pnpm add @jcayzac/shiki-theme-token

# bun
bunx add @jcayzac/shiki-theme-token

# npm
npx add @jcayzac/shiki-theme-token

# yarn
yarn add @jcayzac/shiki-theme-token

# deno
deno add npm:@jcayzac/shiki-theme-token
```

## Usage

Make sure to use both the theme and the transformer together.

```ts
import { createHighlighter } from 'shiki'
import theme from '@jcayzac/shiki-theme-token'
import transformer from '@jcayzac/shiki-transformer-token'

const highlighter = await createHighlighter({
  themes: [theme],
  // …other options
})

// It's better to add the transformer at the end of the list,
// after the other transformers have run.
const transformers = [
  // …other transformers
  transformer(),
]

const rendered = highlighter.codeToHtml(code, {
  theme: 'token',
  defaultColor: false,
  transformers,
  // …other options
}
```

In your CSS, you can then style elements based on the `[data-token]` attribute's value as you see fit. [Here is a sample stylesheet](https://github.com/jcayzac/copepod-modules/blob/main/packages/shiki-theme-token/sample.css). You can apply any style you want, including backgrounds, transitions and whatnot.

## What tokens are supported?

The full TextMate grammar isn't supported, only [a fairly opinionated subset](https://github.com/jcayzac/copepod-modules/blob/main/packages/shiki-theme-token/src/index.ts#L35-L113). Feel free to [open an issue](https://github.com/jcayzac/copepod-modules/issues/new/choose) if you need tokens that aren't supported yet!

> [!TIP]
> You can inspect tokens in Visual Studio Code by selecting `> Developer: Inspect Editor Tokens and Scopes` in the command palette.

## Like it? Buy me a coffee!

If you like anything here, consider buying me a coffee using one of the following platforms:

[GitHub Sponsors](https://github.com/sponsors/jcayzac) ・ [Revolut](https://revolut.me/julienswap) ・ [Wise](https://wise.com/pay/me/julienc375) ・ [Ko-Fi](https://ko-fi.com/jcayzac) ・ [PayPal](https://paypal.me/jcayzac)

---
[license-src]: https://img.shields.io/github/license/jcayzac/copepod-modules?style=for-the-badge&colorA=18181B&colorB=E30074&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Im0yNDMuMTQgMTMxLjU0bC0zMi04MGExMiAxMiAwIDAgMC0xMy43My03LjI1TDE0MCA1N1Y0MGExMiAxMiAwIDAgMC0yNCAwdjIyLjM3TDUzLjQgNzYuMjlhMTIgMTIgMCAwIDAtOC41NCA3LjI1bC0zMiA3OS45MkExMiAxMiAwIDAgMCAxMiAxNjhjMCAxMi4xMyA2LjIgMjIuNDMgMTcuNDUgMjlBNTUgNTUgMCAwIDAgNTYgMjA0YTU1IDU1IDAgMCAwIDI2LjU1LTdDOTMuOCAxOTAuNDMgMTAwIDE4MC4xMyAxMDAgMTY4YTEyIDEyIDAgMCAwLS44Ni00LjQ2TDcyLjM4IDk2LjY1TDExNiA4N3YxMTdoLTEyYTEyIDEyIDAgMCAwIDAgMjRoNDhhMTIgMTIgMCAwIDAgMC0yNGgtMTJWODEuNjNsNDAuNDItOWwtMjMuNTYgNTguOUExMiAxMiAwIDAgMCAxNTYgMTM2YzAgMTIuMTMgNi4yIDIyLjQzIDE3LjQ1IDI5YTUzLjc4IDUzLjc4IDAgMCAwIDUzLjEgMGMxMS4yNS02LjU3IDE3LjQ1LTE2Ljg3IDE3LjQ1LTI5YTEyIDEyIDAgMCAwLS44Ni00LjQ2TTU2IDE4MGMtMy43MSAwLTE4LTEuODctMTkuODEtMTAuMThMNTYgMTIwLjMxbDE5LjgxIDQ5LjUxQzc0IDE3OC4xMyA1OS43MSAxODAgNTYgMTgwbTE0NC0zMmMtMy43MSAwLTE4LTEuODctMTkuODEtMTAuMThMMjAwIDg4LjMxbDE5LjgxIDQ5LjUxQzIxOCAxNDYuMTMgMjAzLjcxIDE0OCAyMDAgMTQ4Ii8+PC9zdmc+
[license-href]: https://github.com/jcayzac/copepod-modules/blob/main/LICENSE
[npm-version-src]: https://img.shields.io/npm/v/@jcayzac/shiki-theme-token?logo=npm&style=for-the-badge&colorA=18181B&colorB=E30074
[npm-version-href]: https://npmjs.com/package/@jcayzac/shiki-theme-token
[npm-downloads-src]: https://img.shields.io/npm/dm/@jcayzac/shiki-theme-token?style=for-the-badge&colorA=18181B&colorB=E30074&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Im0yMjkuNjYgMTQxLjY2bC05NiA5NmE4IDggMCAwIDEtMTEuMzIgMGwtOTYtOTZBOCA4IDAgMCAxIDMyIDEyOGg0MFY0OGExNiAxNiAwIDAgMSAxNi0xNmg4MGExNiAxNiAwIDAgMSAxNiAxNnY4MGg0MGE4IDggMCAwIDEgNS42NiAxMy42NiIvPjwvc3ZnPg==
[npm-downloads-href]: https://npmjs.com/package/@jcayzac/shiki-theme-token
[bundle-src]: https://img.shields.io/bundlephobia/min/@jcayzac/shiki-theme-token?style=for-the-badge&colorA=18181B&colorB=E30074&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0yNDAgMTUydjI0YTE2IDE2IDAgMCAxLTE2IDE2SDExNS45M2E0IDQgMCAwIDEtMy4yNC02LjM1TDE3NC4yNyAxMDFhOC4yMSA4LjIxIDAgMCAwLTEuMzctMTEuM2E4IDggMCAwIDAtMTEuMzcgMS42MWwtNzIgOTkuMDZhNCA0IDAgMCAxLTMuMjggMS42M0gzMmExNiAxNiAwIDAgMS0xNi0xNnYtMjIuODdjMC0xLjc5IDAtMy41Ny4xMy01LjMzYTQgNCAwIDAgMSA0LTMuOEg0OGE4IDggMCAwIDAgOC04LjUzYTguMTcgOC4xNyAwIDAgMC04LjI3LTcuNDdIMjMuOTJhNCA0IDAgMCAxLTMuODctNWMxMi00My44NCA0OS42Ni03Ny4xMyA5NS41Mi04Mi4yOGE0IDQgMCAwIDEgNC40MyA0VjcyYTggOCAwIDAgMCA4LjUzIDhhOC4xNyA4LjE3IDAgMCAwIDcuNDctOC4yN1Y0NC42N2E0IDQgMCAwIDEgNC40My00YTExMi4xOCAxMTIuMTggMCAwIDEgOTUuOCA4Mi4zM2E0IDQgMCAwIDEtMy44OCA1aC0yNC4wOGE4LjE3IDguMTcgMCAwIDAtOC4yNSA3LjQ3YTggOCAwIDAgMCA4IDguNTNoMjcuOTJhNCA0IDAgMCAxIDQgMy44NmMuMDYgMS4zNy4wNiAyLjc1LjA2IDQuMTQiLz48L3N2Zz4=
[bundle-href]: https://bundlephobia.com/result?p=@jcayzac/shiki-theme-token
