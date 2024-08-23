# `@jcayzac/astro-rehype-frontmatter-reading-stats`

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
- `readingTime`: the estimated reading time in minutes.

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
