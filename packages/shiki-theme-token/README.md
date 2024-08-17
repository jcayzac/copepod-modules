# `@jcayzac/shiki-theme-token`

This is a special theme for [Shiki](https://shiki.style) to use together with [`@jcayzac/shiki-transformer-token`](https://www.npmjs.com/package/@jcayzac/shiki-transformer-token).

> [!WARNING]
> Used alone, this theme is non-functional, as it replaces color values with grammar token names and will generate invalid CSS.

## Motivation

Shiki is great, but it can be daunting to create a new theme from scratch, or even just to customize an existing one.

Sure, you can use the experimental [CSS Variables Theme](https://shiki.style/guide/theme-colors#css-variables-theme), which lets you specify a color palette using CSS variables. But that theme uses a very reduced grammar, internally, so the result is not as good as the built-in themes.

This theme gives up on styling completely, and instead replaces color values with grammar token names, which [`@jcayzac/shiki-transformer-token`](https://www.npmjs.com/package/@jcayzac/shiki-transformer-token) then transforms into `[data-token]` attributes in the produces HTML. This gives you complete flexibility on how you want to style your code, not limited to the CSS variables that Shiki supports, and not just colors.

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

In your CSS, you can then style the `[data-token]` attributes as you see fit. [Here is a sample stylesheet](https://github.com/jcayzac/copepod-modules/blob/main/shiki-theme-token/sample.css).

## What tokens are supported?

The full TextMate grammar isn't supported, only [a fairly opinionated subset](https://github.com/jcayzac/copepod-modules/blob/main/shiki-theme-token/src/index.ts#L35-L113). Feel free to [open an issue](https://github.com/jcayzac/copepod-modules/issues/new/choose) if you need tokens that aren't supported yet!

## Like it? Buy me a coffee!

If you like anything here, consider buying me a coffee using one of the following platforms:

[GitHub Sponsors](https://github.com/sponsors/jcayzac) ・ [Revolut](https://revolut.me/julienswap) ・ [Wise](https://wise.com/pay/me/julienc375) ・ [Ko-Fi](https://ko-fi.com/jcayzac) ・ [PayPal](https://paypal.me/jcayzac)
