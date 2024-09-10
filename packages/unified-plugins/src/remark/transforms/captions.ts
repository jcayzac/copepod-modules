import type { Parent } from 'mdast'

/**
 * Support for captions, using the "double blockquote" `>>` syntax.
 */
export function captions(parent: Parent) {
	if (parent.children[1] || parent.type !== 'blockquote' || parent.children[0]?.type !== 'blockquote') {
		return
	}

	parent.data = {
		...parent.data,
		hName: 'figcaption',
	}
	parent.children = parent.children[0].children
}
