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

```sh
# pnpm
pnpm add @jcayzac/astro-classlist

# bun
bunx add @jcayzac/astro-classlist

# npm
npx add @jcayzac/astro-classlist

# yarn
yarn add @jcayzac/astro-classlist

# deno
deno add npm:@jcayzac/astro-classlist
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

[![GitHub Sponsors](https://img.shields.io/badge/GitHub%20Sponsors-E30074?logo=github&logoColor=fff&style=for-the-badge)](https://github.com/sponsors/jcayzac) [![Revolut](https://img.shields.io/badge/Revolut-E30074?logo=revolut&logoColor=fff&style=for-the-badge)](https://revolut.me/julienswap) [![Wise](https://img.shields.io/badge/Wise-E30074?logo=wise&logoColor=fff&style=for-the-badge)](https://wise.com/pay/me/julienc375) [![Ko-Fi](https://img.shields.io/badge/Ko--Fi-E30074?logo=kofi&logoColor=fff&style=for-the-badge)](https://ko-fi.com/jcayzac) [![PayPal](https://img.shields.io/badge/PayPal-E30074?logo=paypal&logoColor=fff&style=for-the-badge)](https://paypal.me/jcayzac)
