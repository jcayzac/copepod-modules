import type * as hast from 'hast'
import type * as unified from 'unified'
import rt from 'reading-time'

export interface FrontmatterReadingStats {
	readingTime: number
	wordCount: number

	[key: string]: any
}

type Plugin<PluginParameters extends any[] = any[]> = unified.Plugin<PluginParameters, hast.Root>

interface MarkdownAstroData {
	frontmatter: Record<string, any>
}

const main: Plugin = () => (tree, file) => {
	let time = 0
	let words = 0
	const queue: hast.Node[] = [tree]

	while (queue[0] !== undefined) {
		const node = queue.shift() as hast.Node

		if (node.type === 'text') {
			const { time: newMilliseconds, words: newWords } = rt((node as hast.Literal).value.trim())

			time += newMilliseconds
			words += newWords
			continue
		}

		const { children } = node as hast.Parent
		if (children)
			queue.push(...children)
	}

	const minutes = time / 60000

	const data = file.data.astro as MarkdownAstroData
	if (data) {
		data.frontmatter = {
			...data.frontmatter ?? {},
			readingTime: minutes,
			wordCount: words,
		}
	}
}

export default main
