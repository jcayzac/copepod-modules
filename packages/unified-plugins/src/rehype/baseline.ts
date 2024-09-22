import type { Parent, Root, Text } from 'hast'
import * as transforms from './transforms'
import { isElement, onlyParents } from './utils'

export interface BaselineOptions {
}

export function baseline(_options: BaselineOptions = {}) {
	return function plugin(root: Root) {
		const queue: Array<Parent> = []
		let parent: Parent | undefined

		// First pass:
		// 1. Trim paragraphs.
		// 2. Remove empty paragraphs.
		queue.push(root)
		// eslint-disable-next-line no-cond-assign
		while (parent = queue.shift()) {
			transforms.paragraphs(parent)

			queue.push(...onlyParents(parent.children))
		}

		// Second pass:
		// 1. Remove lone newlines from all nodes that aren't inside `<code>` or `<pre>`.
		queue.push(root)
		// eslint-disable-next-line no-cond-assign
		while (parent = queue.shift()) {
			if (isElement(parent, /^code|pre$/)) {
				continue
			}

			parent.children = parent.children.filter(node =>
				node.type !== 'text' || (node as Text).value !== '\n',
			)

			queue.push(...onlyParents(parent.children))
		}
	}
}
