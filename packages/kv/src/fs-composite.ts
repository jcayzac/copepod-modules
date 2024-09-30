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

function extract(obj: any, path: string): any {
	return path
		.split(/[.[\]]/)
		.map(x => x.trim())
		.filter(Boolean)
		.reduce((obj, cur) => obj && obj[cur], obj)
}

async function hash(key: object): Promise<string> {
	const table = new WeakMap<object, string>()
	let counter = 0
	function stableHash(arg: any): string {
		const isDate = arg instanceof Date
		const isRegExp = arg instanceof RegExp

		if (Object(arg) === arg && !isDate && !isRegExp) {
			// Object/function, not null/date/regexp. Use WeakMap to store the id first.
			// If it's already hashed, directly return the result.
			let result = table.get(arg)
			if (result) {
				return result
			}

			// Store the hash first for circular reference detection before entering the
			// recursive `stableHash` calls.
			// For other objects like set and map, we use this id directly as the hash.
			result = `${++counter}~`
			table.set(arg, result)
			let index: any

			if (Array.isArray(arg)) {
				result = '@'
				for (index = 0; index < arg.length; index++) {
					result += `${stableHash(arg[index])},`
				}
				table.set(arg, result)
			}
			else if (arg?.constructor === Object) {
				result = '#'
				const keys = Object.keys(arg).sort()
				// eslint-disable-next-line no-cond-assign
				while ((index = keys.pop() as string) !== undefined) {
					if (arg[index] !== undefined) {
						result += `${index}:${stableHash(arg[index])},`
					}
				}
				table.set(arg, result)
			}
			return result
		}
		else if (isDate) {
			return arg.toJSON()
		}
		else {
			return typeof arg === 'string' ? JSON.stringify(arg) : arg.toString()
		}
	}

	const data = new TextEncoder().encode(stableHash(key))
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
		let match: RegExpExecArray | null
		// eslint-disable-next-line no-cond-assign
		while (match = re.exec(pattern)) {
			raws.push(pattern.slice(lastIndex, match.index))
			interpolators.push(match[1]!.trim())
			lastIndex = match.index + match[0].length
		}

		this.root = paths.resolve(root)
		this.raws = raws
		this.interpolators = interpolators
	}

	private async pathFor(key: object) {
		const h = await hash(key)
		const path = String.raw(
			{ raw: this.raws },
			...this.interpolators.map(interpolator =>
				interpolator === '__hash' ? h : extract(key, interpolator)),
		)
		return paths.join(this.root, path)
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
