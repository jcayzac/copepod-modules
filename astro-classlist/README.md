# `@jcayzac/astro-classlist`

This module provides a single utility for [Astro](https://astro.build/) components, that coerce a value received as a [`class:list`](https://docs.astro.build/reference/directives-reference/) prop into an array of strings.

You probably need this if your component receives a `class:list` prop and passes it to a child component, and if you want to add other classes to the list.

Because `class:list` can be an object or an iterable and contain things other than strings, it can get a bit messy if you want to add something to that.

```ts
// This is what you normally get from Astro
type AstroBuiltinAttributes['class:list'] =
  | string
  | Record<string, boolean>
  | Record<any, any>
  | Iterable<string>
  | Iterable<any>
  | undefined

// This is what you get when using this utility
type ClassList = string[]
```

## Installation

This module is available on both the [NPM](https://npmjs.com/) and [JSR](https://jsr.io/) registries. To install it, run:

```sh
# deno
deno add @jcayzac/astro-classlist

# pnpm
pnpm add @jcayzac/astro-classlist

# bun
bunx add @jcayzac/astro-classlist

# npm
npx add @jcayzac/astro-classlist

# yarn
yarn add @jcayzac/astro-classlist
```

## Usage

```astro
---
import ChildComponent from '@components/ChildComponent.astro'
import { ClassList } from '@jcayzac/astro-classlist'

interface Props {
  'class:list': AstroBuiltinAttributes['class:list']
}

const { 'class:list': classes } = props as Props

const classList: ClassList = ClassList.toArray(classes)
---
<ChildComponent class:list={['mx-auto', ...classList]} />
```

## Like it? Buy me a coffee!

If you like anything here, consider buying me a coffee using one of the following platforms:

[GitHub Sponsors](https://github.com/sponsors/jcayzac) ・ [Revolut](https://revolut.me/julienswap) ・ [Wise](https://wise.com/pay/me/julienc375) ・ [Ko-Fi](https://ko-fi.com/jcayzac) ・ [PayPal](https://paypal.me/jcayzac)
