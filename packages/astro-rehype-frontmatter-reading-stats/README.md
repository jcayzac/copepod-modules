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

[GitHub Sponsors](https://github.com/sponsors/jcayzac) ・ [Revolut](https://revolut.me/julienswap) ・ [Wise](https://wise.com/pay/me/julienc375) ・ [Ko-Fi](https://ko-fi.com/jcayzac) ・ [PayPal](https://paypal.me/jcayzac)
