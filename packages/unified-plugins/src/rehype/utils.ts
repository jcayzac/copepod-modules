import type * as hast from 'hast'

export function nodeToString(node: hast.Node): string {
	if (node.type === 'text') {
		const literal = node as hast.Text
		return literal.value.trim()
	}

	if (isParent(node)) {
		return node.children.map(nodeToString).join(' ').replace(/\s+/g, ' ')
	}

	return ''
}

export function onlyParents(nodes: hast.Node[]): hast.Parent[] {
	return nodes.filter(node => isParent(node)) as hast.Parent[]
}

export function isParent(node: hast.Node): node is hast.Parent {
	return 'children' in node && Array.isArray(node.children) && node.children.length > 0
}

export function isElement(node: hast.Node | undefined, withName: string | RegExp | undefined = undefined): node is hast.Element {
	const element = node as hast.Element
	const name = element?.type === 'element' && element.tagName

	if (typeof name !== 'string') {
		return false
	}

	if (withName instanceof RegExp) {
		return withName.test(name)
	}
	else if (typeof withName === 'string') {
		return name === withName
	}

	return true
}
