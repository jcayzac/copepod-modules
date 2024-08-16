import { type Kv, openKv } from '@deno/kv'
import digest from '@local/utils-digest'

export class Cache {
	private readonly ready: Promise<Kv>

	constructor(public name: string) {
		this.ready = openKv(`node_modules/.astro/build-cache.${import.meta.env.MODE}`)
	}

	async cached<T>(keyable: any, generator: () => Promise<T>): Promise<T> {
		const key = [this.name, await digest(new TextEncoder().encode(JSON.stringify(keyable)))]
		const cache = await this.ready
		let { value } = await cache.get<T>(key)
		if (!value) {
			value = await generator()
			await cache.set(key, value).catch(() => {
				// support read-only caches
			})
		}
		return value as T
	}
}
