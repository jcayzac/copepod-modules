import type { ElementContent, Node, Parent, Text } from 'hast'
import { isElement, nodeToString } from '../utils'

export function paragraphs(parent: Parent) {
	const children: Node[] = []
	for (const child of parent.children) {
		if (isElement(child, 'p')) {
			// Skip empty paragraphs
			if (child.children.length === 0) {
				continue
			}

			// Trim start
			let text = child.children[0] as Text
			if (text.type === 'text') {
				text.value = text.value.trimStart()
			}

			// Trim end
			text = child.children[child.children.length - 1] as Text
			if (text.type === 'text') {
				text.value = text.value.trimEnd()
			}

			// Skip empty text paragraphs
			const hasNonText = child.children.some(child => child.type !== 'text')
			const isEmpty = !hasNonText && nodeToString(child).trim() === ''
			if (isEmpty) {
				continue
			}
		}

		// Accept node
		children.push(child)
	}

	parent.children = children as ElementContent[]
}
