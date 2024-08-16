function* all(re: RegExp, text: string): Generator<RegExpExecArray, void, undefined> {
	const r = new RegExp(re.source, re.flags)
	r.lastIndex = 0
	let match: RegExpExecArray | null
	do {
		match = r.exec(text)
		if (match) {
			yield match
		}
	} while (match)
}

export const regex = {
	all,
}
