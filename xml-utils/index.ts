export function escape(s: string) {
	return s.replace(/[<&]/g, c => c === '<' ? '&lt;' : '&amp;')
}
