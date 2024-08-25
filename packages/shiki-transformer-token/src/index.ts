/*
 * A transformer that adds a `data-token` attribute to each token and
 * removes the `style` attribute.
 *
 * It's probably a good idea to keep the transformer first in the chain, since
 * other transformers may add extra styles.
 */

import type { ShikiTransformer } from '@shikijs/core'
import type { Element, Node } from 'hast'

function transformer(): ShikiTransformer {
	return {
		name: 'token',
		span(hast) {
			const { properties } = hast
			const { style } = properties
			if (typeof style !== 'string')
				return

			const [full, token] = /^color:([^;]+);?/.exec(style) ?? []
			if (full === undefined || token === undefined)
				return

			if (token.startsWith('#000000')) {
				console.error(`BUG :(`, { properties })
			}

			delete properties.style

			if (token !== 'editor.foreground') {
				properties['data-token'] = token
			}
		},

		root(hast) {
			const queue = [hast] as Node[]
			while (queue.length > 0) {
				const node = queue.shift() as Node

				if (!('children' in node))
					continue
				const children = node.children as Node[]

				node.children = children
					// Remove empty last line
					.filter((node) => {
						if (node.type !== 'element')
							return true

						const element = node as Element
						if (element.tagName !== 'span')
							return true

						const { 'class': className } = element.properties
						if (className !== 'line')
							return true

						const { children } = element
						return children.at(-1) !== undefined
					})
					// Replace spans that aren't tokens with just their inner text
					.map((node) => {
						if (node.type !== 'element')
							return node

						const element = node as Element
						if (element.tagName !== 'span')
							return node

						if (element.properties['data-token'] !== undefined)
							return node

						const { children } = element
						if (children.length !== 1)
							return node

						const child = children[0]
						if (child?.type !== 'text')
							return node

						return child
					})

				queue.push(...children)
			}
		},
	}
}

export default transformer
