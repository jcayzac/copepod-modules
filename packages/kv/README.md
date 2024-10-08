# `@copepod/kv`

> Pluggable, statically-configured modular key-value stores.

[![license][license-src]][license-href]
[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]

> [!CAUTION]
> **Under development:** This module is under development and not ready for production use. The API is neither complete nor stable, and may change without notice.

## Installation

```sh
# pnpm
pnpm add @copepod/kv

# bun
bunx add @copepod/kv

# npm
npx add @copepod/kv

# yarn
yarn add @copepod/kv

# deno
deno add npm:@copepod/kv
```

## Configuration

Configuration is static: there is no API to configure stores, and all the necessary configuration is in the configuration file.

The configuration file associates store identifiers with backends and backend parameters. It can be a JSON file, a YAML file, a Javascript or Typescript file, and must be named `kv.config.*` where `*` is the extension of the file. It's also possible to simply pass a configuration in the project's `package.json` file under the `kv` key.

### Examples

#### `package.json`

```json
{
  "name": "my-project",
  "type": "module",
  "version": "1.0.0",
  // other fields omitted
  "kv": {
    "stores": [
      {
        "id": "build-cache",
        "use": "@copepod/kv/fs-simple",
        "with": {
          "path": ".cache"
        }
      },
      // Add more stores here
    ]
  }
}
```

#### `kv.config.ts`

```ts
import type { Config } from '@copepod/kv/config'

const buildCache: {
  // Store id
  id: 'build-cache',
  // Backend module
  use: '@copepod/kv/fs-simple',
  // Backend configuration
  with: {
    path: '.cache',
  },
}

export default {
  stores: [
    buildCache,
  ],
} satisfies Config
```

## Usage

```ts
import { kv } from '@copepod/kv'

// Get a store. If no store is defined for that id, returns `undefined`.
const store = await kv.store('build-cache')

// Get value with key 'image.jpg' from store
const value = await store.get('image.jpg')

// Set value with key 'image.jpg' in store 'images'
const success = await store.set('image.jpg', value)

// Now delete that entry
await store.set('image.jpg', undefined)
```

## API

* `kv.store<Key>(store: string): Promise<Store<Key> | undefined>`: Get a store by its id.
* `store.get(key: Key): Promise<Uint8Array | undefined>`: Get a value from a store. The key can be any keyable material understood by the store backend.
* `store.set(key: Key, value: Uint8Array | undefined): Promise<boolean>`: Set a value in a store. Passing `undefined` as the value will delete the key from the store. Returns `true` if the operation was successful, `false` otherwise.

## Backends

Backends are modules that implement the key-value store interface. Here is a very simple backend that stores values in memory (which is admitedly not very useful):

```ts
import type { Store } from '@copepod/kv/types'

export interface Config {
  [key: string]: any
}

export default class MemoryStore implements Store<string> {
  private cache: Map<string, Uint8Array>

  constructor(params: Config) {
    this.cache = new Map()
  }

  async get(key) {
    return cache.get(key)
  }

  async set(key, value) {
    if (value === undefined) {
      cache.delete(key)
    }
    else {
      cache.set(key, value)
    }
  }
}
```

Backends are composable. You can create a backend that uses another backend to store values, and add additional features. Here's a backend that supports composite keys and use the previous backend to store values:

```ts
import type { Store } from '@copepod/kv/types'
import MemoryStore from './MemoryStore'

export interface CompositeKey {
  a: string
  b: string
}

export default class CompositeKeyMemoryStore implements Store<CompositeKey> {
  private underlyingStore: MemoryStore

  constructor(params: { [key: string]: any }) {
    // You could derive a different configuration for the underlying
    // store from the params, here.
    this.underlyingStore = new MemoryStore(params)
  }

  async get(key) {
    return this.underlyingStore.get(JSON.stringify([key.a, key.b]))
  }

  async set(key, value) {
    return this.underlyingStore.set(JSON.stringify([key.a, key.b]), value)
  }
}
```

You can of course do more interesting things in your backends. Here is one that stores images on the filesystem based on transformation parameters:

```ts
import type { Store } from '@copepod/kv/types'
import { readFile, writeFile } from 'node:fs/promises'

export interface Config {
  path: string
  [key: string]: any
}

export interface Key {
  name: string
  type: string
  width: number
  height: number
  [key: string]: string | number
}

export default class ImageStore implements Store<TransformParams> {
  private path: string

  constructor(params) {
    const { path } = params as Config
    this.path = path
  }

  async get(key) {
    const { name, type, width, height, ...rest } = key
    const other = Object.entries(rest).toSorted((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => `${k}=${v}`).join(',')
    const path = `${this.path}/${name}[${width},${height},${other}].${type}`
    try {
      return await readFile(path)
    }
    catch {
      return undefined
    }
  }

  async set(key, value) {
    const { name, type, width, height } = key
    const other = Object.entries(rest).toSorted((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => `${k}=${v}`).join(',')
    const path = `${this.path}/${name}[${width},${height},${other}].${type}`
    try {
      await writeFile(path, value)
      return true
    }
    catch {
      return false
    }
  }
}
```

## FAQ

### Can I set a TTL?

No, this module does not support TTLs. It provides simple key-value stores with no expiration mechanism.

TTLs can be implemented by the backends, for instance by accepting expiration dates in composite keys.

## Like it? Buy me a coffee!

If you like anything here, consider buying me a coffee using one of the following platforms:

[![GitHub Sponsors](https://img.shields.io/badge/GitHub%20Sponsors-E30074?logo=github&logoColor=fff&style=for-the-badge)](https://github.com/sponsors/jcayzac) [![Revolut](https://img.shields.io/badge/Revolut-E30074?logo=revolut&logoColor=fff&style=for-the-badge)](https://revolut.me/julienswap) [![Wise](https://img.shields.io/badge/Wise-E30074?logo=wise&logoColor=fff&style=for-the-badge)](https://wise.com/pay/me/julienc375) [![Ko-Fi](https://img.shields.io/badge/Ko--Fi-E30074?logo=kofi&logoColor=fff&style=for-the-badge)](https://ko-fi.com/jcayzac) [![PayPal](https://img.shields.io/badge/PayPal-E30074?logo=paypal&logoColor=fff&style=for-the-badge)](https://paypal.me/jcayzac)

---
[license-src]: https://img.shields.io/github/license/jcayzac/copepod-modules?style=for-the-badge&colorA=18181B&colorB=E30074&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Im0yNDMuMTQgMTMxLjU0bC0zMi04MGExMiAxMiAwIDAgMC0xMy43My03LjI1TDE0MCA1N1Y0MGExMiAxMiAwIDAgMC0yNCAwdjIyLjM3TDUzLjQgNzYuMjlhMTIgMTIgMCAwIDAtOC41NCA3LjI1bC0zMiA3OS45MkExMiAxMiAwIDAgMCAxMiAxNjhjMCAxMi4xMyA2LjIgMjIuNDMgMTcuNDUgMjlBNTUgNTUgMCAwIDAgNTYgMjA0YTU1IDU1IDAgMCAwIDI2LjU1LTdDOTMuOCAxOTAuNDMgMTAwIDE4MC4xMyAxMDAgMTY4YTEyIDEyIDAgMCAwLS44Ni00LjQ2TDcyLjM4IDk2LjY1TDExNiA4N3YxMTdoLTEyYTEyIDEyIDAgMCAwIDAgMjRoNDhhMTIgMTIgMCAwIDAgMC0yNGgtMTJWODEuNjNsNDAuNDItOWwtMjMuNTYgNTguOUExMiAxMiAwIDAgMCAxNTYgMTM2YzAgMTIuMTMgNi4yIDIyLjQzIDE3LjQ1IDI5YTUzLjc4IDUzLjc4IDAgMCAwIDUzLjEgMGMxMS4yNS02LjU3IDE3LjQ1LTE2Ljg3IDE3LjQ1LTI5YTEyIDEyIDAgMCAwLS44Ni00LjQ2TTU2IDE4MGMtMy43MSAwLTE4LTEuODctMTkuODEtMTAuMThMNTYgMTIwLjMxbDE5LjgxIDQ5LjUxQzc0IDE3OC4xMyA1OS43MSAxODAgNTYgMTgwbTE0NC0zMmMtMy43MSAwLTE4LTEuODctMTkuODEtMTAuMThMMjAwIDg4LjMxbDE5LjgxIDQ5LjUxQzIxOCAxNDYuMTMgMjAzLjcxIDE0OCAyMDAgMTQ4Ii8+PC9zdmc+
[license-href]: https://github.com/jcayzac/copepod-modules/blob/main/LICENSE
[npm-version-src]: https://img.shields.io/npm/v/@copepod/kv?logo=npm&style=for-the-badge&colorA=18181B&colorB=E30074
[npm-version-href]: https://npmjs.com/package/@copepod/kv
[npm-downloads-src]: https://img.shields.io/npm/dm/@copepod/kv?style=for-the-badge&colorA=18181B&colorB=E30074&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Im0yMjkuNjYgMTQxLjY2bC05NiA5NmE4IDggMCAwIDEtMTEuMzIgMGwtOTYtOTZBOCA4IDAgMCAxIDMyIDEyOGg0MFY0OGExNiAxNiAwIDAgMSAxNi0xNmg4MGExNiAxNiAwIDAgMSAxNiAxNnY4MGg0MGE4IDggMCAwIDEgNS42NiAxMy42NiIvPjwvc3ZnPg==
[npm-downloads-href]: https://npmjs.com/package/@copepod/kv
[bundle-src]: https://img.shields.io/bundlephobia/min/@copepod/kv?style=for-the-badge&colorA=18181B&colorB=E30074&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0yNDAgMTUydjI0YTE2IDE2IDAgMCAxLTE2IDE2SDExNS45M2E0IDQgMCAwIDEtMy4yNC02LjM1TDE3NC4yNyAxMDFhOC4yMSA4LjIxIDAgMCAwLTEuMzctMTEuM2E4IDggMCAwIDAtMTEuMzcgMS42MWwtNzIgOTkuMDZhNCA0IDAgMCAxLTMuMjggMS42M0gzMmExNiAxNiAwIDAgMS0xNi0xNnYtMjIuODdjMC0xLjc5IDAtMy41Ny4xMy01LjMzYTQgNCAwIDAgMSA0LTMuOEg0OGE4IDggMCAwIDAgOC04LjUzYTguMTcgOC4xNyAwIDAgMC04LjI3LTcuNDdIMjMuOTJhNCA0IDAgMCAxLTMuODctNWMxMi00My44NCA0OS42Ni03Ny4xMyA5NS41Mi04Mi4yOGE0IDQgMCAwIDEgNC40MyA0VjcyYTggOCAwIDAgMCA4LjUzIDhhOC4xNyA4LjE3IDAgMCAwIDcuNDctOC4yN1Y0NC42N2E0IDQgMCAwIDEgNC40My00YTExMi4xOCAxMTIuMTggMCAwIDEgOTUuOCA4Mi4zM2E0IDQgMCAwIDEtMy44OCA1aC0yNC4wOGE4LjE3IDguMTcgMCAwIDAtOC4yNSA3LjQ3YTggOCAwIDAgMCA4IDguNTNoMjcuOTJhNCA0IDAgMCAxIDQgMy44NmMuMDYgMS4zNy4wNiAyLjc1LjA2IDQuMTQiLz48L3N2Zz4=
[bundle-href]: https://bundlephobia.com/result?p=@copepod/kv
