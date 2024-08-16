import type { Heading } from 'mdast'
import type { Node, Parent } from 'unist'
import { findAfter } from 'unist-util-find-after'
import { type Visitor, visit } from 'unist-util-visit'
import { slug as slugify } from 'github-slugger'
import { isHeading, isParent } from '../remark-utils'

interface Options {
	maxDepth?: number
}

function text(node: Node): string {
	const value = []
	if ('value' in node && typeof node.value === 'string')
		value.push(node.value)

	if (isParent(node)) {
		for (const child of node.children) {
			value.push(text(child))
		}
	}

	return value.join('')
}

function isHeadingWithDepthMatching(node: Node, test: (_: number) => boolean) {
	return isHeading(node) ? test(node.depth) : false
}

function match(depth: number) {
	return (node: Node) => isHeadingWithDepthMatching(node, d => d === depth)
}

function buildSection(parent: Parent, start: number, end: number, props: Record<string, string>) {
	// Grab children from start to end.
	const children = parent.children.slice(start, end > 0 ? end : undefined)

	// Make a section.
	const section = {
		type: 'section',
		children,
		data: {
			hName: 'section',
			hProperties: {
				...props,
			},
		},
	}

	// Replace the children with the section.
	parent.children.splice(start, children.length, section)
	return section
}

function plugin({ maxDepth = 3 }: Options = {}) {
	const visitor = (node: Heading, index: number, parent: Parent) => {
		const depth = node.depth
		const headingSlug = slugify(text(node))

		const end = findAfter(parent, node, node =>
			isHeadingWithDepthMatching(node, d => d <= depth))

		buildSection(
			parent,
			index ?? 0,
			(end && parent.children.indexOf(end)) ?? 0,
			{
				'data-id': headingSlug,
			},
		)
	}

	return (tree: Parent) => {
		for (let depth = maxDepth; depth > 0; depth--)
			visit(tree, match(depth), visitor as Visitor)
	}
}

export default plugin
