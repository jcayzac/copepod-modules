import type { Parent, Root } from 'mdast'
import type { LinkOptions } from './transforms/loners/links'
import * as transforms from './transforms'
import * as utils from './utils'

export interface BaselineOptions {
	links?: LinkOptions | undefined
}

export function baseline(options: BaselineOptions = {}) {
	return function plugin(root: Root) {
		const queue: Array<Parent> = []
		let parent: Parent | undefined

		queue.push(root)
		// eslint-disable-next-line no-cond-assign
		while (parent = queue.shift()) {
			transforms.asides(parent)
			transforms.captions(parent)
			transforms.loners(parent, options.links ?? {})
			queue.push(...utils.onlyParents(parent.children))
		}

		queue.push(root)
		// eslint-disable-next-line no-cond-assign
		while (parent = queue.shift()) {
			transforms.figures(parent)
			queue.push(...utils.onlyParents(parent.children))
		}
	}
}
