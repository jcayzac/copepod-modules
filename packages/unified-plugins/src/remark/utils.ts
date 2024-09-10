import type * as mdast from 'mdast'

export interface AnyData { data?: { [key: string]: any } }

export function nodeToString(node: mdast.Node): string {
	if (node.type === 'text') {
		const literal = node as mdast.Text
		return literal.value.trim()
	}

	if (isParent(node)) {
		return node.children.map(nodeToString).join(' ').replace(/\s+/g, ' ')
	}

	return ''
}

export function onlyParents(nodes: mdast.Node[]): mdast.Parent[] {
	return nodes.filter(node => isParent(node)) as mdast.Parent[]
}

export function isParent(node: mdast.Node | undefined | null): node is mdast.Parent {
	const asParent = node ? node as mdast.Parent : node
	return Array.isArray(asParent?.children) && asParent.children[0] !== undefined
}

export function isLink(node: mdast.Node | undefined | null): node is mdast.Link {
	return node?.type === 'link'
}

export function isParagraph(node: mdast.Node | undefined | null): node is mdast.Paragraph {
	return node?.type === 'paragraph'
}

export function isText(node: mdast.Node | undefined | null): node is mdast.Text {
	return node?.type === 'text'
}
