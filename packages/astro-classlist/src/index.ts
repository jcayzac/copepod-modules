import type { AstroBuiltinAttributes } from 'astro'

/**
 * The type of the `class:list` attribute.
 */
export type ClassList = string[]

/**
 * A utility object for working with the `class:list` attribute.
 */
export interface ClassListStaticFunctions {
	/**
	 * Converts an astro `class:list` expression to an array of strings.
	 * This is useful when you want to accept a `class:list` prop and pass it
	 * to a component, while adding your own classes too.
	 */
	toArray: (classList: AstroBuiltinAttributes['class:list']) => ClassList
}

/**
 * A utility object for working with the `class:list` attribute.
 */
// eslint-disable-next-line ts/no-redeclare
export const ClassList: ClassListStaticFunctions = {
	/**
	 * Converts an astro `class:list` expression to an array of strings.
	 * This is useful when you want to accept a `class:list` prop and pass it
	 * to a component, while adding your own classes too.
	 */
	toArray(classList: AstroBuiltinAttributes['class:list']): ClassList {
		if (typeof classList === 'string') {
			return [classList]
		}

		if (Array.isArray(classList)) {
			return classList
		}

		if (classList !== null || classList !== undefined) {
			if ((classList as any)[Symbol.iterator] !== undefined) {
				return [...(classList as Iterable<any>)].map(classList => classList.toString())
			}

			if (typeof classList === 'object') {
				return Object.entries(classList)
					.filter(([_, v]) => !!v)
					.map(([k]) => k)
			}
		}

		return []
	},
}
