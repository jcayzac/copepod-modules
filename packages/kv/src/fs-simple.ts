import type { Store, StoreParams } from './types'
import { mkdir, readdir, readFile, rmdir, unlink, writeFile } from 'node:fs/promises'
import paths from 'node:path'
import { digest } from './utils'

export interface Params extends StoreParams {
	path: string
}

async function pathForKey(path: string, key: string): Promise<string> {
	const hash = await digest(new TextEncoder().encode(key))
	return paths.join(path, hash.slice(0, 2), hash.slice(2, 4), hash.slice(4, 6), hash.slice(6))
}

class SimpleStore implements Store<string> {
	private readonly path: string

	constructor(public readonly params: Params) {
		this.path = paths.resolve(params.path)
	}

	async get(key: string): Promise<Uint8Array | undefined> {
		const path = await pathForKey(this.path, key)
		try {
			return await readFile(path)
		}
		catch {
			return undefined
		}
	}

	async set(key: string, value: Uint8Array | undefined): Promise<void> {
		const path = await pathForKey(this.path, key)
		try {
			if (value !== undefined) {
				await mkdir(paths.dirname(path), { recursive: true })
				await writeFile(path, value)
			}
			else {
				// Delete entry
				await unlink(path)

				// Prune empty directories
				let dir = path
				while (true) {
					const oldDir = dir
					dir = paths.dirname(oldDir)
					if (dir === oldDir) {
						break
					}

					const content = await readdir(dir)
					if (content.length) {
						break
					}

					await rmdir(dir)
				}
			}
		}
		catch {
			// no-op
		}
	}
}

export default SimpleStore
