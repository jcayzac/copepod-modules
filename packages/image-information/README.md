# `@jcayzac/image-information`

> Lightweight detection of local or remote images' type, orientation & size in pure Javascript.

[![license][license-src]][license-href]
[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]

This module detect informations about local or remote images. For remote images, it streams the data only until it finds information.

Images in the following formats are supported: [GIF](https://docs.fileformat.com/image/gif/), [HEIC](https://docs.fileformat.com/image/heic/), [HEIF](https://docs.fileformat.com/image/heif/), [AVIF](https://docs.fileformat.com/image/avif/), [J2C](https://docs.fileformat.com/image/j2c/), [JP2](https://docs.fileformat.com/image/jp2/), [JPEG](https://docs.fileformat.com/image/jpeg/), [PNG](https://docs.fileformat.com/image/png/), [SVG](https://docs.fileformat.com/page-description-language/svg/) & [WebP](https://docs.fileformat.com/image/webp/).

## Usage

```sh
# pnpm
pnpm add @jcayzac/image-information

# bun
bunx add @jcayzac/image-information

# npm
npx add @jcayzac/image-information

# yarn
yarn add @jcayzac/image-information

# deno
deno add npm:@jcayzac/image-information
```

### Getting information about an image from a URL

```ts
import { imageInformation } from '@jcayzac/image-information'

// Remote URL
const info = await imageInformation('https://example.com/image.jpg')
if (info !== undefined) {
  const {
    // intrinsic width.
    width,

    // intrinsic height.
    height,

    // inferred file extension (doesn't care about URL).
    extension,

    // inferred MIME type.
    type,

    // detected EXIF orientation, if any.
    orientation,
  } = info

  console.log(`Found information:`, info)
}

// File URL
const info2 = await imageInformation('file:///tmp/image.jpg')
```

> [!NOTE]
>
> The function accepts strings as a convenience, but those are expected to represent valid URLs. For local images, you must use the `file://` URL scheme. Passing paths directly will not work.

### Getting information about an image from a buffer

The `probe()` function can be used to get information about an image from a buffer (either an `Uint8Array` or a node `Buffer`).

```ts
import { readFile } from 'node:fs/promises'
import { probe } from '@jcayzac/image-information'

const buffer = await readFile('image.jpg')
const info = await probe(buffer)
```

## Like it? Buy me a coffee!

If you like anything here, consider buying me a coffee using one of the following platforms:

[![GitHub Sponsors](https://img.shields.io/badge/GitHub%20Sponsors-E30074?logo=github&logoColor=fff&style=for-the-badge)](https://github.com/sponsors/jcayzac) [![Revolut](https://img.shields.io/badge/Revolut-E30074?logo=revolut&logoColor=fff&style=for-the-badge)](https://revolut.me/julienswap) [![Wise](https://img.shields.io/badge/Wise-E30074?logo=wise&logoColor=fff&style=for-the-badge)](https://wise.com/pay/me/julienc375) [![Ko-Fi](https://img.shields.io/badge/Ko--Fi-E30074?logo=kofi&logoColor=fff&style=for-the-badge)](https://ko-fi.com/jcayzac) [![PayPal](https://img.shields.io/badge/PayPal-E30074?logo=paypal&logoColor=fff&style=for-the-badge)](https://paypal.me/jcayzac)

---
[license-src]: https://img.shields.io/github/license/jcayzac/copepod-modules?style=for-the-badge&colorA=18181B&colorB=E30074&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Im0yNDMuMTQgMTMxLjU0bC0zMi04MGExMiAxMiAwIDAgMC0xMy43My03LjI1TDE0MCA1N1Y0MGExMiAxMiAwIDAgMC0yNCAwdjIyLjM3TDUzLjQgNzYuMjlhMTIgMTIgMCAwIDAtOC41NCA3LjI1bC0zMiA3OS45MkExMiAxMiAwIDAgMCAxMiAxNjhjMCAxMi4xMyA2LjIgMjIuNDMgMTcuNDUgMjlBNTUgNTUgMCAwIDAgNTYgMjA0YTU1IDU1IDAgMCAwIDI2LjU1LTdDOTMuOCAxOTAuNDMgMTAwIDE4MC4xMyAxMDAgMTY4YTEyIDEyIDAgMCAwLS44Ni00LjQ2TDcyLjM4IDk2LjY1TDExNiA4N3YxMTdoLTEyYTEyIDEyIDAgMCAwIDAgMjRoNDhhMTIgMTIgMCAwIDAgMC0yNGgtMTJWODEuNjNsNDAuNDItOWwtMjMuNTYgNTguOUExMiAxMiAwIDAgMCAxNTYgMTM2YzAgMTIuMTMgNi4yIDIyLjQzIDE3LjQ1IDI5YTUzLjc4IDUzLjc4IDAgMCAwIDUzLjEgMGMxMS4yNS02LjU3IDE3LjQ1LTE2Ljg3IDE3LjQ1LTI5YTEyIDEyIDAgMCAwLS44Ni00LjQ2TTU2IDE4MGMtMy43MSAwLTE4LTEuODctMTkuODEtMTAuMThMNTYgMTIwLjMxbDE5LjgxIDQ5LjUxQzc0IDE3OC4xMyA1OS43MSAxODAgNTYgMTgwbTE0NC0zMmMtMy43MSAwLTE4LTEuODctMTkuODEtMTAuMThMMjAwIDg4LjMxbDE5LjgxIDQ5LjUxQzIxOCAxNDYuMTMgMjAzLjcxIDE0OCAyMDAgMTQ4Ii8+PC9zdmc+
[license-href]: https://github.com/jcayzac/copepod-modules/blob/main/LICENSE
[npm-version-src]: https://img.shields.io/npm/v/@jcayzac/image-information?logo=npm&style=for-the-badge&colorA=18181B&colorB=E30074
[npm-version-href]: https://npmjs.com/package/@jcayzac/image-information
[npm-downloads-src]: https://img.shields.io/npm/dm/@jcayzac/image-information?style=for-the-badge&colorA=18181B&colorB=E30074&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Im0yMjkuNjYgMTQxLjY2bC05NiA5NmE4IDggMCAwIDEtMTEuMzIgMGwtOTYtOTZBOCA4IDAgMCAxIDMyIDEyOGg0MFY0OGExNiAxNiAwIDAgMSAxNi0xNmg4MGExNiAxNiAwIDAgMSAxNiAxNnY4MGg0MGE4IDggMCAwIDEgNS42NiAxMy42NiIvPjwvc3ZnPg==
[npm-downloads-href]: https://npmjs.com/package/@jcayzac/image-information
[bundle-src]: https://img.shields.io/bundlephobia/min/@jcayzac/image-information?style=for-the-badge&colorA=18181B&colorB=E30074&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0yNDAgMTUydjI0YTE2IDE2IDAgMCAxLTE2IDE2SDExNS45M2E0IDQgMCAwIDEtMy4yNC02LjM1TDE3NC4yNyAxMDFhOC4yMSA4LjIxIDAgMCAwLTEuMzctMTEuM2E4IDggMCAwIDAtMTEuMzcgMS42MWwtNzIgOTkuMDZhNCA0IDAgMCAxLTMuMjggMS42M0gzMmExNiAxNiAwIDAgMS0xNi0xNnYtMjIuODdjMC0xLjc5IDAtMy41Ny4xMy01LjMzYTQgNCAwIDAgMSA0LTMuOEg0OGE4IDggMCAwIDAgOC04LjUzYTguMTcgOC4xNyAwIDAgMC04LjI3LTcuNDdIMjMuOTJhNCA0IDAgMCAxLTMuODctNWMxMi00My44NCA0OS42Ni03Ny4xMyA5NS41Mi04Mi4yOGE0IDQgMCAwIDEgNC40MyA0VjcyYTggOCAwIDAgMCA4LjUzIDhhOC4xNyA4LjE3IDAgMCAwIDcuNDctOC4yN1Y0NC42N2E0IDQgMCAwIDEgNC40My00YTExMi4xOCAxMTIuMTggMCAwIDEgOTUuOCA4Mi4zM2E0IDQgMCAwIDEtMy44OCA1aC0yNC4wOGE4LjE3IDguMTcgMCAwIDAtOC4yNSA3LjQ3YTggOCAwIDAgMCA4IDguNTNoMjcuOTJhNCA0IDAgMCAxIDQgMy44NmMuMDYgMS4zNy4wNiAyLjc1LjA2IDQuMTQiLz48L3N2Zz4=
[bundle-href]: https://bundlephobia.com/result?p=@jcayzac/image-information
