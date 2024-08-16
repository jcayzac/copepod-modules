# The Copepod Nursery

This is a collection of modules I use in my projects. I'm publishing them here so you can use them in yours if you feel like it.

## Installation

Modules are published on the [JSR registry](https://jsr.io/).

I'm not a node person. I think node was nice in the middle ages of internet. I'm a [deno](https://deno.land/) person now. That's why you won't find any of these on the NPM registry: I can't be bothered to use medieval tools like esbuild to transpile typescript and publish my code.

Fortunately, you don't have to care about what I like or not. You can still use the modules as you would use any other module. You just have to use the `jsr` command to pull them:

```sh
# deno
deno add @jcayzac/<module-name>

# pnpm
pnpm dlx jsr add @jcayzac/<module-name>

# bun
bunx jsr add @jcayzac/<module-name>

# npm
npx jsr add @jcayzac/<module-name>

# yarn
yarn dlx jsr add @jcayzac/<module-name>
```

For more information, see the [JSR documentation](https://jsr.io/docs/using-packages).

## Usage

See the `README` file in each of the module, or the docs published on [jsr.io](jsr.io).

## Like it? Buy me a coffee!

If you like anything here, consider buying me a coffee using one of the following methods:

- [GitHub](https://github.com/sponsors/jcayzac)
- [Ko-Fi](https://ko-fi.com/jcayzac)
- Revolut: `@julienswap`
- Wise: `@julienc375`
