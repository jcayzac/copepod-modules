import type { Parent, Root } from 'mdast'
import GithubSlugger from 'github-slugger'
import * as utils from './utils'
import * as transforms from './transforms'
import type { LinkOptions } from './transforms/loners/links'

const SLUGGER = new GithubSlugger()

export interface BaselineOptions {
	links?: LinkOptions | undefined
}

export function baseline(options: BaselineOptions = {}) {
	return function plugin(root: Root) {
		SLUGGER.reset()

		const queue: Array<Parent> = []
		let parent: Parent | undefined

		queue.push(root)
		// eslint-disable-next-line no-cond-assign
		while (parent = queue.shift()) {
			transforms.asides(parent)
			transforms.captions(parent)
			transforms.headings(parent, SLUGGER)
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
