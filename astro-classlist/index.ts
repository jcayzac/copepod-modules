import type { AstroBuiltinAttributes } from 'astro'

export type ClassList = AstroBuiltinAttributes['class:list']

/**
 * Convert an astro `class:list` expression to an array of strings.
 * This is useful when you want to accept a `class:list` prop and pass it
 * to a component, while adding your own classes too.
 */
function toArray(classList: ClassList): string[] {
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
}

// eslint-disable-next-line ts/no-redeclare
export const ClassList = {
	toArray,
}
