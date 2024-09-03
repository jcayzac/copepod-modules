# `@jcayzac/astro-rehype-frontmatter-reading-stats`

> Word count and estimated reading time for Astro Markdown/MDX content.

[![license][license-src]][license-href]
[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]

[Rehype](https://github.com/rehypejs/rehype) plugin to add the word count and estimated reading time to the frontmatter of Markdown documents loaded by [Astro](https://astro.build/).

## Installation

```sh
# pnpm
pnpm add @jcayzac/astro-rehype-frontmatter-reading-stats

# bun
bunx add @jcayzac/astro-rehype-frontmatter-reading-stats

# npm
npx add @jcayzac/astro-rehype-frontmatter-reading-stats

# yarn
yarn add @jcayzac/astro-rehype-frontmatter-reading-stats

# deno
deno add npm:@jcayzac/astro-rehype-frontmatter-reading-stats
```

## Usage

Add the plugin to your Astro project's `astro.config.mjs`:

```ts
import { defineConfig } from 'astro/config'
import readingStats from '@jcayzac/astro-rehype-frontmatter-reading-stats'

export default defineConfig({
  markdown: {
    rehypePlugins: [
      readingStats(),
    ]
  }
})
```

The frontmatter of your Markdown documents will have new fields added:

- `wordCount`: the approximate number of words in the document.
- `readingTime`: the estimated reading time in minutes, rounded.

   > [!TIP]
   > if you want an [ISO-8601 duration](https://en.wikipedia.org/wiki/ISO_8601#Durations), for example to use in a [`<time>`](https://developer.mozilla.org/docs/Web/HTML/Element/time) HTML element, simply use `` `PT${readingTime}M` ``.

You can access those in your Astro components:

```astro
---
import { type CollectionEntry } from 'astro:content'

interface Props {
  article: CollectionEntry<'articles'>
}

const { article } = props as Props
const { Content, remarkPluginFrontmatter } = await article.render()
const { wordCount, readingTime } = remarkPluginFrontmatter
---
<div>
  <h1>{article.title}</h1>
  <p>{wordCount} words</p>
  <time datetime={`PT${readingTime}M`}>A {readingTime}min read</time>
  <Content />
</div>
```

## Like it? Buy me a coffee!

If you like anything here, consider buying me a coffee using one of the following platforms:

[![GitHub Sponsors](https://img.shields.io/badge/GitHub%20Sponsors-E30074?logo=github&logoColor=fff&style=for-the-badge)](https://github.com/sponsors/jcayzac) [![Revolut](https://img.shields.io/badge/Revolut-E30074?logo=revolut&logoColor=fff&style=for-the-badge)](https://revolut.me/julienswap) [![Wise](https://img.shields.io/badge/Wise-E30074?logo=wise&logoColor=fff&style=for-the-badge)](https://wise.com/pay/me/julienc375) [![Ko-Fi](https://img.shields.io/badge/Ko--Fi-E30074?logo=kofi&logoColor=fff&style=for-the-badge)](https://ko-fi.com/jcayzac) [![PayPal](https://img.shields.io/badge/PayPal-E30074?logo=paypal&logoColor=fff&style=for-the-badge)](https://paypal.me/jcayzac)

---
[license-src]: https://img.shields.io/github/license/jcayzac/copepod-modules?style=for-the-badge&colorA=18181B&colorB=E30074&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Im0yNDMuMTQgMTMxLjU0bC0zMi04MGExMiAxMiAwIDAgMC0xMy43My03LjI1TDE0MCA1N1Y0MGExMiAxMiAwIDAgMC0yNCAwdjIyLjM3TDUzLjQgNzYuMjlhMTIgMTIgMCAwIDAtOC41NCA3LjI1bC0zMiA3OS45MkExMiAxMiAwIDAgMCAxMiAxNjhjMCAxMi4xMyA2LjIgMjIuNDMgMTcuNDUgMjlBNTUgNTUgMCAwIDAgNTYgMjA0YTU1IDU1IDAgMCAwIDI2LjU1LTdDOTMuOCAxOTAuNDMgMTAwIDE4MC4xMyAxMDAgMTY4YTEyIDEyIDAgMCAwLS44Ni00LjQ2TDcyLjM4IDk2LjY1TDExNiA4N3YxMTdoLTEyYTEyIDEyIDAgMCAwIDAgMjRoNDhhMTIgMTIgMCAwIDAgMC0yNGgtMTJWODEuNjNsNDAuNDItOWwtMjMuNTYgNTguOUExMiAxMiAwIDAgMCAxNTYgMTM2YzAgMTIuMTMgNi4yIDIyLjQzIDE3LjQ1IDI5YTUzLjc4IDUzLjc4IDAgMCAwIDUzLjEgMGMxMS4yNS02LjU3IDE3LjQ1LTE2Ljg3IDE3LjQ1LTI5YTEyIDEyIDAgMCAwLS44Ni00LjQ2TTU2IDE4MGMtMy43MSAwLTE4LTEuODctMTkuODEtMTAuMThMNTYgMTIwLjMxbDE5LjgxIDQ5LjUxQzc0IDE3OC4xMyA1OS43MSAxODAgNTYgMTgwbTE0NC0zMmMtMy43MSAwLTE4LTEuODctMTkuODEtMTAuMThMMjAwIDg4LjMxbDE5LjgxIDQ5LjUxQzIxOCAxNDYuMTMgMjAzLjcxIDE0OCAyMDAgMTQ4Ii8+PC9zdmc+
[license-href]: https://github.com/jcayzac/copepod-modules/blob/main/LICENSE
[npm-version-src]: https://img.shields.io/npm/v/@jcayzac/astro-rehype-frontmatter-reading-stats?logo=npm&style=for-the-badge&colorA=18181B&colorB=E30074
[npm-version-href]: https://npmjs.com/package/@jcayzac/astro-rehype-frontmatter-reading-stats
[npm-downloads-src]: https://img.shields.io/npm/dm/@jcayzac/astro-rehype-frontmatter-reading-stats?style=for-the-badge&colorA=18181B&colorB=E30074&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Im0yMjkuNjYgMTQxLjY2bC05NiA5NmE4IDggMCAwIDEtMTEuMzIgMGwtOTYtOTZBOCA4IDAgMCAxIDMyIDEyOGg0MFY0OGExNiAxNiAwIDAgMSAxNi0xNmg4MGExNiAxNiAwIDAgMSAxNiAxNnY4MGg0MGE4IDggMCAwIDEgNS42NiAxMy42NiIvPjwvc3ZnPg==
[npm-downloads-href]: https://npmjs.com/package/@jcayzac/astro-rehype-frontmatter-reading-stats
[bundle-src]: https://img.shields.io/bundlephobia/min/@jcayzac/astro-rehype-frontmatter-reading-stats?style=for-the-badge&colorA=18181B&colorB=E30074&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0yNDAgMTUydjI0YTE2IDE2IDAgMCAxLTE2IDE2SDExNS45M2E0IDQgMCAwIDEtMy4yNC02LjM1TDE3NC4yNyAxMDFhOC4yMSA4LjIxIDAgMCAwLTEuMzctMTEuM2E4IDggMCAwIDAtMTEuMzcgMS42MWwtNzIgOTkuMDZhNCA0IDAgMCAxLTMuMjggMS42M0gzMmExNiAxNiAwIDAgMS0xNi0xNnYtMjIuODdjMC0xLjc5IDAtMy41Ny4xMy01LjMzYTQgNCAwIDAgMSA0LTMuOEg0OGE4IDggMCAwIDAgOC04LjUzYTguMTcgOC4xNyAwIDAgMC04LjI3LTcuNDdIMjMuOTJhNCA0IDAgMCAxLTMuODctNWMxMi00My44NCA0OS42Ni03Ny4xMyA5NS41Mi04Mi4yOGE0IDQgMCAwIDEgNC40MyA0VjcyYTggOCAwIDAgMCA4LjUzIDhhOC4xNyA4LjE3IDAgMCAwIDcuNDctOC4yN1Y0NC42N2E0IDQgMCAwIDEgNC40My00YTExMi4xOCAxMTIuMTggMCAwIDEgOTUuOCA4Mi4zM2E0IDQgMCAwIDEtMy44OCA1aC0yNC4wOGE4LjE3IDguMTcgMCAwIDAtOC4yNSA3LjQ3YTggOCAwIDAgMCA4IDguNTNoMjcuOTJhNCA0IDAgMCAxIDQgMy44NmMuMDYgMS4zNy4wNiAyLjc1LjA2IDQuMTQiLz48L3N2Zz4=
[bundle-href]: https://bundlephobia.com/result?p=@jcayzac/astro-rehype-frontmatter-reading-stats
