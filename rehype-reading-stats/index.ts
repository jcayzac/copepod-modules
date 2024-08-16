/*
 * Calculates the approximate reading time of the content  and adds it to the
 * frontmatter of the file.
 */
import type { MarkdownAstroData, RehypePlugin } from '@astrojs/markdown-remark'
import type { Literal, Node, Parent } from 'hast'
import rt from 'reading-time'

const main: RehypePlugin = () => (tree, file) => {
	const data = file.data.astro as MarkdownAstroData

	let time = 0
	let words = 0
	const queue: Node[] = [tree]

	while (queue[0] !== undefined) {
		const node = queue.shift() as Node

		if (node.type === 'text') {
			const { time: newMilliseconds, words: newWords } = rt((node as Literal).value.trim())

			time += newMilliseconds
			words += newWords
			continue
		}

		const { children } = node as Parent
		if (children)
			queue.push(...children)
	}

	const minutes = time / 60000
	const seconds = (time % 60000) / 1000

	data.frontmatter = {
		...data.frontmatter,
		readingTime: `${Math.ceil(minutes)} min read`,
		readingTimePT: `PT${Math.floor(minutes)}M${Math.floor(seconds)}S`,
		wordCount: words,
	}
}

export default main
