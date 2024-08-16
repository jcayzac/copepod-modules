import type { Heading, Link, Node, Paragraph, Parent, Text } from 'mdast'
import type { MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx-jsx'

export function isText(node: Node | undefined | null): node is Text {
	return node?.type === 'text'
}

export function isLink(node: Node | undefined | null): node is Link {
	return node?.type === 'link'
}

export function isHeading(node: Node | undefined | null): node is Heading {
	return node?.type === 'heading'
}

export function isParagraph(node: Node | undefined | null): node is Paragraph {
	return node?.type === 'paragraph'
}

export function isMdxJsxFlowElement(node: Node | undefined | null): node is MdxJsxFlowElement {
	return node?.type === 'mdxJsxFlowElement'
}

export function isMdxJsxTextElement(node: Node | undefined | null): node is MdxJsxTextElement {
	return node?.type === 'mdxJsxTextElement'
}

export function isParent(node: Node | undefined | null): node is Parent {
	return node?.type !== undefined && 'children' in node && Array.isArray(node.children)
}

export function addMdxJsxAttribute(node: MdxJsxFlowElement, name: string, value: string | undefined | null | false | '') {
	if (!value)
		return

	if (!node.attributes) {
		node.attributes = []
	}

	node.attributes.push({
		type: 'mdxJsxAttribute',
		name,
		value,
	})
}
