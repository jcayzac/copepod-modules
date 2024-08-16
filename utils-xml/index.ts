/**
 * Returns a minimally-escaped version of the input text, suitable for using in an XML node attribute or as text below an XML element.
 * 
 * This function only escapes the following characters:
 * 
 * - `&` becomes `&amp;`
 * - `<` becomes `&lt;`
 * 
 * Other characters are left unescaped.
 */
export function escape(text: string): string {
	return text.replace(/[<&]/g, c => c === '<' ? '&lt;' : '&amp;')
}
