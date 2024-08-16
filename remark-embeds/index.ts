/*
 * Lookup single links in a paragraph and turn them into image tags
 * routing to Embed.astro.
 */
import type { Node, Parent } from 'mdast'
import type { MdxJsxFlowElement, MdxJsxFlowElementData } from 'mdast-util-mdx-jsx'
import { toString } from 'mdast-util-to-string'
import { visitParents } from 'unist-util-visit-parents'
import type { TestFunction } from 'unist-util-is'
import micromatch from 'micromatch'
import { isLink, isMdxJsxTextElement, isParagraph, isText } from '../remark-utils'

export interface EmbedsMatch {
	use: string
	for: string[]
}

export default function (matches: EmbedsMatch[]) {
	return (tree: Parent) => {
		const test: TestFunction = node => isLink(node)
		visitParents(tree, test, (node, ancestors) => {
			const parent = ancestors.at(-1)
			const container = ancestors.at(-2)

			if (!isLink(node) || !isParagraph(parent) || !container) {
				return
			}

			// Ignore bank lines in the paragraph.
			const neighbors = parent.children
				.filter(n => n !== node)
				.filter(n => !isText(n) || n.value.trim() !== '')

			if (neighbors.length > 1) {
				return
			}

			// If the figcaption is on the same paragraph, we must preserve it.
			const figcaption = neighbors.length === 1 && neighbors[0]
			if (figcaption) {
				if (!isMdxJsxTextElement(figcaption) || figcaption.name !== 'figcaption') {
					return
				}
			}

			// Find paragraph inside container.
			const children = container.children as Node[]
			const index = children.indexOf(parent)
			if (index === -1) {
				return
			}

			// Only process absolute URLs.
			const { url } = node
			if (!url.startsWith('https://'))
				return

			// Route URL to component.
			const { pathname, hostname } = new URL(url)
			const use = matches.find(({ for: patterns }) =>
				micromatch.isMatch(`${hostname}${pathname}`, patterns),
			)?.use
			if (!use)
				return

			// Use an Embed to route the component.
			const substitute: MdxJsxFlowElement = {
				type: 'mdxJsxFlowElement',
				name: 'Embed',
				attributes: [
					{
						type: 'mdxJsxAttribute',
						name: 'src',
						value: url,
					},
					{
						type: 'mdxJsxAttribute',
						name: 'data-route',
						value: use,
					},
				],
				children: [],
				data: { _mdxExplicitJsx: true } as MdxJsxFlowElementData,
			}

			// toString(node) will return the xxxx in [xxxx](url), flattened.
			const title = toString(node)
			if (title !== '' && title !== url) {
				substitute.attributes.push({
					type: 'mdxJsxAttribute',
					name: 'title',
					value: title,
				})
			}

			// Carry over position information
			if (node.position !== undefined) {
				substitute.position = node.position
			}

			if (figcaption) {
				parent.children = [figcaption]
				children.splice(index, 0, substitute)
			}
			else {
				// Replace the paragraph with the Embed.
				children[index] = substitute
			}
		})
	}
}
