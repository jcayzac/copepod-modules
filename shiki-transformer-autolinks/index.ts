import type { ShikiTransformer } from 'shiki'
import type { ShikiTransformerContextCommon } from '@shikijs/core'
import type { Position } from 'unist'
import type { ElementContent, Node, Text } from 'hast'
import * as textutils from '@local/text-utils'

interface Meta {
	linkTitles: Map<string, string>
}

function meta(context: ShikiTransformerContextCommon) {
	return context.meta as Meta
}

function makeNode<T extends Node>(node: T, position: Position | undefined, offset: number, span: number): T {
	if (!position)
		return node

	const start = structuredClone(position.start)
	start.column += offset
	if (start.offset !== undefined)
		start.offset += offset

	const end: typeof start = {
		column: start.column + span,
		line: start.line,
	}
	if (start.offset !== undefined)
		end.offset = start.offset + span

	node.position = {
		start,
		end,
	}

	return node
}

function transformer(): ShikiTransformer {
	return {
		name: 'autolinks',
		// Use the preprocess phase to extract Markdown link titles
		preprocess(code: string) {
			const linkTitles = new Map<string, string>()

			for (const [_, title, url] of textutils.regex.all(/\[([^\]]+)\]\(([^)]+)\)/g, code)) {
				linkTitles.set(url, title)
			}
			meta(this).linkTitles = linkTitles
		},

		// Look at each span for any links.
		span(span) {
			// We want spans with onle one child, a text node.
			if (span.children.length !== 1)
				return
			let child = span.children[0]
			if (child.type !== 'text')
				return

			// Grab our link titles index from the meta.
			const { linkTitles } = meta(this)

			// Find all URLs in the text node.
			const found: { href: string, index: number }[] = []
			for (const { 0: value, index } of textutils.regex.all(/https?:\/\/\S+/g, child.value)) {
				// If the URL ends with punctuation, keep it outside the link unless it's a /
				const last = value[value.length - 1]
				const hasPunctuation = (last !== '/' && /\p{P}/u.test(last))
				const href = hasPunctuation ? value.slice(0, -1) : value
				found.unshift({ href, index })
			}

			// Nothing was found, so we can skip this span.
			if (found.length === 0)
				return

			// Grab the span's position, we'll need it later.
			const { position } = span

			// Iterate over the found URLs. Note that 'found' is in reverse order already.
			const children: ElementContent[] = []
			for (const { href, index } of found) {
				// Add the text after the URL
				const postIndex = index + href.length
				const post = child.value.slice(postIndex)
				if (post.length > 0) {
					children.unshift(makeNode<Text>({
						type: 'text',
						value: post,
					}, position, postIndex, post.length))
				}

				// Add the link.
				children.unshift(makeNode({
					type: 'element',
					tagName: 'a',
					properties: {
						href,
						title: linkTitles.get(href),
						target: '_blank',
						rel: 'nofollow noreferrer',
					},
					children: [
						makeNode<Text>({
							type: 'text',
							value: href,
						}, position, index, href.length),
					],
				}, position, index, href.length))

				// Cut the head.
				child = makeNode<Text>({
					type: 'text',
					value: child.value.slice(0, index),
				}, position, 0, index)
			}

			// Add the remaining text if any.
			if (child.value.length > 0) {
				children.unshift(child)
			}

			span.children = children
		},
	}
}

export default transformer
