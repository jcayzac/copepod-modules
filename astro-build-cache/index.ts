import { env } from 'node:process'
import { type Kv, openKv } from '@deno/kv'
import digest from '@jcayzac/utils-digest'

const MODE = env.NODE_ENV === 'production' ? 'production' : 'development'

/**
 * A simple cache for Astro build artifacts, using sqlite3 files stored in `node_modules/.astro/build-cache.<mode>`.
 *
 * Read-only caches are supported.
 */
export class Cache {
	private readonly ready: Promise<Kv>

	/**
	 * @param name Name of the cache. Cached content is scoped by name.
	 */
	constructor(public name: string = 'null') {
		this.ready = openKv(`node_modules/.astro/build-cache.${MODE}`)
	}

	/**
	 * Return a value, possibly generating it if it didn't already exist.
	 *
	 * @param keyable Anything that can be serialized to JSON. Should contain every relevant dependencies (e.g. options used when generating the value).
	 * @param generator Asynchronous function that generates the value if it didn't already exist in the cache.
	 * @returns The cached value.
	 */
	// deno-lint-ignore no-explicit-any
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
