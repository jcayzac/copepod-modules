import type { Store, StoreParams } from './types'
import paths from 'node:path'
import { deleteFile, readFile, writeFile } from './utils'

export interface Params extends StoreParams {
	/**
	 * The root directory of the store.
	 */
	path: string

	/**
	 * The pattern to use for determining the paths where to store values.
	 * Use `{field}` to interpolate fields from the key, e.g. `{name}.[{width},{height}].{format}`.
	 *
	 * Subfields can be accessed using dot notation, e.g. `{name}.{options.quality}.{format}`.
	 * Array subscripts can be accessed using square brackets, e.g. `{name}-{categories[0].name}.{type}`.
	 *
	 * The special interpolator `{__hash}` returns a short hash value of the key.
	 */
	pattern: string
}

/**
 * Extract a value from an object using a path.
 */
function extract(obj: any, path: string): any {
	return path
		.split(/[.[\]]/)
		.map(x => x.trim())
		.filter(Boolean)
		.reduce((obj, cur) => obj && obj[cur], obj)
}

async function hash(key: object): Promise<string> {
	const hashed = new WeakMap<object, string>()
	let counter = 0
	function inner(arg: any): string {
		const isDate = arg instanceof Date
		const isRegExp = arg instanceof RegExp

		if (Object(arg) === arg && !isDate && !isRegExp) {
			let result = hashed.get(arg)
			if (!result) {
				// Prevent circular references from blowing up the stack.
				result = `${++counter}~`
				hashed.set(arg, result)

				if (Array.isArray(arg)) {
					result = '@'
					for (let index = 0; index < arg.length; index++) {
						result += `${inner(arg[index])},`
					}
				}
				else if (arg?.constructor === Object) {
					result = '#'
					for (const [k, v] of Object.entries(arg).sort((a, b) => b[0].localeCompare(a[0]))) {
						if (v !== undefined) {
							result += `${k}:${inner(v)},`
						}
					}
				}

				hashed.set(arg, result)
			}

			return result
		}
		else {
			switch (typeof arg) {
				case 'string':
					return JSON.stringify(arg)
				case 'symbol':
					return arg.toString()
				default:
					return isDate ? arg.toJSON() : `${arg}`
			}
		}
	}

	const data = new TextEncoder().encode(inner(key))
	return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', data)))
		.map(b => b.toString(16).padStart(2, '0'))
		.join('')
		.slice(0, 7)
}

export default class CompositeStore implements Store<object> {
	private readonly root: string
	private readonly raws: string[]
	private readonly interpolators: string[]

	constructor(params: Params) {
		const { path: root, pattern } = params
		/*
     * From `pattern`, extract all interpolators using the regular expression
     * `/{([^}]+)}/g` and produce two arrays: one with all the raw strings, and
     * another with all the interpolators.
     */
		const raws: string[] = []
		const interpolators: string[] = []
		let lastIndex = 0
		const re = /\{([^{}]+)\}/g
		while (true) {
			const match = re.exec(pattern)
			if (!match) {
				break
			}

			raws.push(pattern.slice(lastIndex, match.index))
			interpolators.push(match[1]!.trim())
			lastIndex = match.index + match[0].length
		}
		raws.push(pattern.slice(lastIndex))

		this.root = paths.resolve(root)
		this.raws = raws
		this.interpolators = interpolators
	}

	private async pathFor(key: object) {
		const interpolated = []
		for (const interpolator of this.interpolators) {
			interpolated.push(interpolator === '__hash' ? await hash(key) : extract(key, interpolator) ?? '')
		}
		return paths.join(this.root, String.raw({ raw: this.raws }, ...interpolated))
	}

	async get(key: object): Promise<Uint8Array | undefined> {
		const path = await this.pathFor(key)
		return await readFile(path)
	}

	async set(key: object, value: Uint8Array | undefined): Promise<boolean> {
		const path = await this.pathFor(key)
		return await (value !== undefined ? writeFile(path, value) : deleteFile(path))
	}
}
