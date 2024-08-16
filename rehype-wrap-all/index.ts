/*
 * For each [selector, wrapper element] in the provided list, wrap all
 * elements matching the selector with copy of the wrapper element.
 */
import type { Root } from 'hast'
import { parseSelector } from 'hast-util-parse-selector'
import { selectAll } from 'hast-util-select'
import { visit } from 'unist-util-visit'

export interface Options {
	selector: string
	wrapper?: string
}

function transform(tree: Root, { selector, wrapper = 'div' }: Options) {
	for (const match of selectAll(selector, tree)) {
		const wrap = parseSelector(wrapper)
		visit(tree, match, (node, i, parent) => {
			if (i === undefined || !parent)
				return
			parent.children[i] = {
				...structuredClone(wrap),
				children: [node],
			}
		})
	}
}

export function wrapAll(...allOptions: Options[]) {
	return (tree: Root) => {
		for (const options of allOptions) transform(tree, options)
	}
}
