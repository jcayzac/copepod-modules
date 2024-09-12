import { mkdir, writeFile } from 'node:fs/promises'
import type { AstroIntegration } from 'astro'
import YAML from 'yaml'
import type * as hast from 'hast'
import type * as mdast from 'mdast'
import type * as unified from 'unified'

interface Roots {
	rehype: hast.Root
	remark: mdast.Root
}

function makePlugin<K extends keyof Roots>(key: K): unified.Plugin<[], Roots[K]> {
	return (() => async (tree: Roots[K], file: {
		cwd: string
		data: {
			astro: {
				frontmatter: { [key: string]: any }
			}
		}
		history: [string, ...string[]]
		value: string
	}) => {
		const [, slug] = /\/([^/]+)(?:\/index)?\.mdx?$/.exec(file.history[0]) ?? []
		await mkdir(`${file.cwd}/.${key}`, { recursive: true })
		await writeFile(`${file.cwd}/.${key}/${slug}.yaml`, YAML.stringify(tree), 'utf8')
		return tree
	}) as any
}

export default function integration(): AstroIntegration {
	return {
		name: '@jcayzac/astro-markdown-tree-dump',
		hooks: {
			'astro:config:setup': ({ updateConfig }) => {
				updateConfig({
					markdown: {
						remarkPlugins: [makePlugin('remark')],
						rehypePlugins: [makePlugin('rehype')],
					},
				})
			},
		},
	} satisfies AstroIntegration
}
