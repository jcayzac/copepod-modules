/**
 * Regular expression utilities.
 */
export class RegExpUtils {
	/**
	 * Generates all matches of a regular expression in a text.
	 * 
	 * @param regex Regular expression to match against.
	 * @param text Input text.
	 * @returns An iterator over all matches.
	 * 
	 * @example Basic usage
	 * ```ts
	 * for (const match of regex.all(/(ra)(\w)/g, 'abracadabra')) {
	 *   console.log(`Found a match:`, match)
	 * }
	 * ```
	 * 
	 * @example Destructuring groups
	 * ```ts
	 * for (const [_, ra, letterAfterRa] of regex.all(/(ra)(\w)/g, 'abracadabra')) {
	 *   console.log(`Found "ra", followed by "${letterAfterRa}""`)
	 * }
	 * ```
	 * 
	 * @example Destructuring groups, with index information
	 * ```ts
	 * for (const { 1: ra, index } of regex.all(/(ra)/g, 'abracadabra')) {
	 *   console.log(`Found "ra" at index ${index}`)
	 * }
	 * ```
	 */
	static *all(regex: RegExp, text: string): Generator<RegExpExecArray, void, undefined> {
		const r = new RegExp(regex.source, regex.flags)
		r.lastIndex = 0
		let match: RegExpExecArray | null
		do {
			match = r.exec(text)
			if (match) {
				yield match
			}
		} while (match)
	}
}


/**
 * Alias for {@linkcode RegExpUtils}.
 */
export const regex = RegExpUtils