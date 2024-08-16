#!/usr/bin/env -S deno run -A
import { ensureDir } from 'jsr:@std/fs'

if (import.meta.main) {
  const [packageName, packageVersion] = Deno.args
  if (!packageName || !packageVersion) {
    console.error(`Usage: ${new URL(Deno.mainModule).pathname} <package-name> <package-version>`)
    Deno.exit(1)
  }

  console.info(`Looking up ${packageName} v${packageVersion} on jsr.io…`)

  const [_, scope, name] = /^@([^/]+)\/(.+)$/.exec(packageName) ?? []

  const { versions } = await fetch(`https://npm.jsr.io/@jsr/${scope}__${name}`).then((res) => res.json())
  const { description, dist: { tarball: tarballUrl } } = versions[packageVersion]

  const blob = await fetch(tarballUrl).then((res) => res.blob())

  await using tarball = await (async () => {
    const path = await Deno.makeTempFile()
    return {
      path,
      [Symbol.asyncDispose]: async () => {
        await Deno.remove(path)
      }
    }
  })()

  await Deno.remove('./npm', { recursive: true })
  await ensureDir('./npm')
  await Deno.writeFile(tarball.path, new Uint8Array(await blob.arrayBuffer()))

  const untar = await new Deno.Command(`tar`, {
    cwd: './npm',
    args: ['xzf', tarball.path, '--strip-components=1'],
  }).spawn().output()

  if (!untar.success) {
    throw new Error('Failed to extract tarball')
  }

  let packageJson = JSON.parse(await Deno.readTextFile('./npm/package.json'))
  packageJson = {
    ...packageJson,
    name: `@${scope}/${name}`,
    description,
    author: `Julien Cayzac`,
    license: 'MIT',
    repository: {
      type: 'git',
      url: `https://github.com/jcayzac/copepod-modules.git`,
      directory: name,
    },
    publishConfig: {
      access: 'public',
      registry: 'https://registry.npmjs.org/',
    },
    bugs: `https://github.com/jcayzac/copepod-modules/issues`,
    homepage: `https://github.com/jcayzac/copepod-modules/tree/main/${name}#readme`,
    dependencies: Object.fromEntries(Object.entries(packageJson.dependencies ?? {}).map(([packageName, version]) => {
      let remappedName = packageName

      const [_, scope, name] = /^@jsr\/([^/]+?)__(.+)$/.exec(packageName) ?? []
      if (name) {
        remappedName = `@${scope}/${name}`
      }

      return [remappedName, version]
    })),
  }
  delete packageJson._jsr_revision

  await Deno.writeTextFile('./npm/package.json', JSON.stringify(packageJson, null, 2))

  // deno-lint-ignore no-constant-condition
  if (false) {
    const npm = await new Deno.Command(`npm`, {
      cwd: './npm',
      args: ['publish'],
    }).spawn().output()

    if (!npm.success) {
      throw new Error('Failed to publish to npm')
    }
  }
}
