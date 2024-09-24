/*
 Route code blocks to components based on the 'language' attribute.
 */
import type { Code, Parent, Root } from 'mdast'
import type { MdxJsxAttribute, MdxJsxFlowElement } from 'mdast-util-mdx-jsx'
import { onlyParents } from './utils'

export interface FencesOptions {
	/**
	 * A map of language to MDX component name.
	 */
	readonly componentRoutes?: Record<string, string> | undefined

	/**
	 * Breakpoints for code blocks based on the maximum line length.
	 */
	readonly breakpoints?: [number, string][] | undefined
}

export function fences(options: FencesOptions = {}) {
	const componentRoutes = options.componentRoutes ?? {}
	const breakpoints = (options.breakpoints ?? []).toSorted((a, b) => b[0] - a[0])

	return function plugin(root: Root) {
		const queue: Array<Parent> = []
		let parent: Parent | undefined

		// First pass: Replace code blocks with components.
		queue.push(root)
		// eslint-disable-next-line no-cond-assign
		while (parent = queue.shift()) {
			for (const [index, child] of parent.children.entries()) {
				if (child.type !== 'code') {
					continue
				}
				const { lang, meta, data: oldData = {}, value } = child as Code

				// If no component is registered for the language, skip.
				const component = lang && componentRoutes[lang]
				if (!component) {
					continue
				}

				// If the meta string has `source`, skip.
				const metaTokens = meta?.split(' ') ?? []
				if (metaTokens.includes('source')) {
					child.meta = metaTokens.filter(token => token !== 'source').join(' ')
					continue
				}

				const mdx = {
					type: 'mdxJsxFlowElement',
					name: component,
					attributes: [
						{
							type: 'mdxJsxAttribute',
							name: 'meta',
							value: meta ?? '',
						},
						{
							type: 'mdxJsxAttribute',
							name: 'source',
							value,
						},
					] satisfies MdxJsxAttribute[],
					children: [],
					position: child.position,
					data: {
						...oldData,
					},
				} as MdxJsxFlowElement
				parent.children[index] = mdx
			}

			queue.push(...onlyParents(parent.children))
		}

		// Second pass: Add breakpoints to code blocks.
		if (breakpoints.length) {
			queue.push(root)
			// eslint-disable-next-line no-cond-assign
			while (parent = queue.shift()) {
				for (const child of parent.children) {
					if (child.type !== 'code') {
						continue
					}
					const { data = {}, value } = child as Code

					// Count characters per line and set breakpoints
					const maxLength = value.split('\n').map(line => line.length).reduce((max, len) => Math.max(max, len), 0)
					for (const [length, breakpoint] of breakpoints) {
						if (maxLength >= length) {
							child.data = {
								...data,
								hProperties: {
									...data?.hProperties,
									'data-breakpoint': breakpoint,
								},
							}
							break
						}
					}
				}
				queue.push(...onlyParents(parent.children))
			}
		}
	}
}
