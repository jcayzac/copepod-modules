import type { BlockContent, Blockquote, Parent } from 'mdast'
import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx'
import type * as utils from '../utils'

export function figures(parent: Parent) {
	const parentJSX = parent as MdxJsxFlowElement & utils.AnyData

	let len = parent.children.length
	for (let i = 0; i < len; i++) {
		const child = parent.children[i] as MdxJsxFlowElement & utils.AnyData

		// Wrap <figcaption> elements and their previous sibling in a <figure>
		if (i > 0
			&& (child.data?.hName === 'figcaption' || (child.type === 'mdxJsxFlowElement' && child.name === 'figcaption'))
			&& !(parentJSX.data?.hName === 'figure' || (parent.type === 'mdxJsxFlowElement' && parentJSX.name === 'figure'))
		) {
			--len
			const captioned = parent.children[--i] as BlockContent
			parent.children.splice(i, 2, {
				type: 'blockquote',
				data: {
					hName: 'figure',
				},
				position: captioned.position,
				children: [captioned, child],
			} satisfies Blockquote)
		}
	}
}
