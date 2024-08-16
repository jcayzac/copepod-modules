/*
 * Lookup figcaption elements and wrap them in a figure element together
 * with the element that precedes them.
 */
import type { BlockContent, Node, Parent } from 'mdast'
import type { MdxJsxFlowElement, MdxJsxFlowElementData } from 'mdast-util-mdx-jsx'
import { visitParents } from 'unist-util-visit-parents'
import type { TestFunction } from 'unist-util-is'
import { isMdxJsxFlowElement, isParent } from '../remark-utils'

export default function () {
	return (tree: Parent) => {
		const test: TestFunction = node => isMdxJsxFlowElement(node) && node.name === 'figcaption'
		visitParents(tree, test, (node, ancestors) => {
			// Don't do anything if an ancestor is already a figure element
			for (const parent of ancestors) {
				if (isMdxJsxFlowElement(parent) && parent.name === 'figure')
					return
				if (parent.data?.hName === 'figure')
					return
			}

			const parent = ancestors.at(-1)
			if (!isParent(parent))
				return

			const children = parent.children as Node[]
			const index = children.indexOf(node)
			const embed = children[index - 1] as BlockContent
			const wrapper: MdxJsxFlowElement = {
				type: 'mdxJsxFlowElement',
				name: 'figure',
				attributes: [],
				children: [
					embed,
					node as BlockContent,
				],
				data: { _mdxExplicitJsx: true } as MdxJsxFlowElementData,
			}

			if (embed.position?.start !== undefined && node.position?.end !== undefined) {
				wrapper.position = {
					start: embed.position.start,
					end: node.position.end,
				}
			}

			children.splice(index - 1, 2, wrapper)
		})
	}
}
