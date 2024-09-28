import type { Store, StoreParams } from './types'
import paths from 'node:path'
import { deleteFile, digest, readFile, writeFile } from './utils'

export interface Params extends StoreParams {
	path: string
}

async function pathForKey(path: string, key: string): Promise<string> {
	const hash = await digest(new TextEncoder().encode(key))
	return paths.join(path, hash.slice(0, 2), hash.slice(2, 4), hash.slice(4, 6), hash.slice(6))
}

class SimpleStore implements Store<string> {
	private readonly path: string

	constructor(params: Params) {
		this.path = paths.resolve(params.path)
	}

	async get(key: string): Promise<Uint8Array | undefined> {
		const path = await pathForKey(this.path, key)
		return await readFile(path)
	}

	async set(key: string, value: Uint8Array | undefined): Promise<boolean> {
		const path = await pathForKey(this.path, key)
		return await (value !== undefined ? writeFile(path, value) : deleteFile(path))
	}
}

export default SimpleStore
