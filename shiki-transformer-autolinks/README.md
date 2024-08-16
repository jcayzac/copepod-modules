# `@jcayzac/shiki-transformer-autolinks`

A transformer for [Shiki](https://shiki.style/) that automatically turns URLs into links.

## Motivation

When you are editing code in an IDE, URLs are often clickable. Whether it's a link to reference documentation in a code comment or a link to an image passed as the `src` attribute of an HTML `<img>` element, you may want to visit the link.

Wouldn't it be nice if code rendered by Shiki also had clickable URLs? This is what this transformer enables.

## Features

- Anything that looks like a URL starting with `https://` is turned into a clickable link. If the URL ends with punctuation, the punctuation is not part of the generated link.
- For Markdown markup, the transformer also looks for a title. This means that the link generated for e.g. `[Some title](https://example.com)` has a `title` attribute set to `Some title`.
- The generated links are keyboard-navigable, and use `target="_blank" rel="nofollow noreferrer"`.
- They're easy to style: just target `code :any-link` in your CSS!

## Installation

This module is available on both the [NPM](https://npmjs.com/) and [JSR](https://jsr.io/) registries. To install it, run:

```sh
# deno
deno add @jcayzac/shiki-transformer-autolinks

# pnpm
pnpm add @jcayzac/shiki-transformer-autolinks

# bun
bunx add @jcayzac/shiki-transformer-autolinks

# npm
npx add @jcayzac/shiki-transformer-autolinks

# yarn
yarn add @jcayzac/shiki-transformer-autolinks
```

## Like it? Buy me a coffee!

If you like anything here, consider buying me a coffee using one of the following platforms:

[GitHub Sponsors](https://github.com/sponsors/jcayzac) ・ [Revolut](https://revolut.me/julienswap) ・ [Wise](https://wise.com/pay/me/julienc375) ・ [Ko-Fi](https://ko-fi.com/jcayzac) ・ [PayPal](https://paypal.me/jcayzac)
