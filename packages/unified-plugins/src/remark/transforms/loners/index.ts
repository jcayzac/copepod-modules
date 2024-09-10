import type { Parent, PhrasingContent, RootContent } from 'mdast'
import 'mdast-util-to-hast'
import { isLink } from '../../utils'
import { type LinkOptions, type LinkTransform, processLink } from './links'

const LONERS_MD = new Set(['image'])
const LONERS_MDX = new Set([
	'img',
	'figcaption',
	'picture',
	'video',
])

export type { LinkTransform }

export function loners(parent: Parent, options: LinkOptions = {}): void {
	for (const [index, child] of parent.children.entries()) {
		if (child.type === 'paragraph' && child.children[0] && !child.children[1]) {
			// This paragraph has only one child
			const loner = child.children[0] as PhrasingContent & { name?: string }
			let replacer: Parent | undefined

			if (LONERS_MD.has(loner.type)) {
				// Unwrap the loner
				replacer = loner as Parent
			}
			else if (/^mdxJsx.+Element$/.test(loner.type) && LONERS_MDX.has(loner.name ?? '')) {
				// Unwrap the loner and mark it as a flow element
				replacer = {
					...loner,
					type: 'mdxJsxFlowElement',
				} as Parent
			}
			else if (isLink(loner)) {
				replacer = processLink(loner, options)
			}

			if (replacer) {
				parent.children[index] = replacer as RootContent
			}
		}
	}
}
