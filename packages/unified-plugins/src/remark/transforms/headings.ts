import type { Link, Parent, PhrasingContent } from 'mdast'
import { nodeToString } from '../utils'

export interface Slugger {
	slug: (value: string) => string
}

/**
 * Wrap a heading's content in a link to itself and add an ID using the provided slugger.
 * @note This is not included anymore in the baseline plugin by default.
 */
export function headings(parent: Parent, slugger: Slugger) {
	if (parent.type !== 'heading' || !parent.children[0]) {
		return
	}

	const slug = slugger.slug(nodeToString(parent))
	parent.data = {
		...parent.data,
		id: slug,
	} as Parent['data']
	parent.children = [
		{
			type: 'link',
			url: `#${slug}`,
			title: null,
			children: parent.children as PhrasingContent[],
			position: parent.position,
		} satisfies Link,
	]
}
