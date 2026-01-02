/**
 * @file Process fenced code blocks in Markdown files.
 *
 * 1. Route code blocks to components based on the 'language' attribute.
 * 2. Add breakpoints based on the maximum line length.
 * 3. Route unregistered languages to a default component if specified.
 */
import type { Code, Parent, Root } from 'mdast'
import type { MdxJsxAttribute, MdxJsxAttributeValueExpression, MdxJsxFlowElement } from 'mdast-util-mdx-jsx'
import { onlyParents } from './utils'

export interface FencesOptions {
	/**
	 * Default component name if no route is found.
	 */
	readonly defaultComponent?: string | undefined

	/**
	 * A map of language to MDX component name.
	 */
	readonly componentRoutes?: Record<string, string> | undefined

	/**
	 * Breakpoints for code blocks based on the maximum line length.
	 */
	readonly breakpoints?: [number, string][] | undefined
}

function makeElement(
	code: Code,
	component: string,
	attributes: Record<string, MdxJsxAttributeValueExpression | string | null>,
) {
	return {
		type: 'mdxJsxFlowElement',
		name: component,
		attributes: Object.entries(attributes).map(([name, value]) => ({
			type: 'mdxJsxAttribute',
			name,
			value,
		} satisfies MdxJsxAttribute)),
		children: [],
		position: code.position,
		data: {
			...code.data,
		},
	} as MdxJsxFlowElement
}

export function fences(options: FencesOptions = {}) {
	const { defaultComponent } = options
	const componentRoutes = options.componentRoutes ?? {}
	const breakpoints = (options.breakpoints ?? []).toSorted((a, b) => b[0] - a[0])

	return function plugin(root: Root) {
		const queue: Array<Parent> = []
		let parent: Parent | undefined

		// First pass: Add breakpoints to code elements.
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
					let match = 0
					for (const [length, breakpoint] of breakpoints) {
						if (maxLength >= length && length > match) {
							match = length
							child.data = {
								...data,
								hProperties: {
									...data?.hProperties,
									'data-breakpoint': breakpoint,
								},
							}
						}
					}
				}
				queue.push(...onlyParents(parent.children))
			}
		}

		// First pass: Replace code blocks with components.
		queue.push(root)
		// eslint-disable-next-line no-cond-assign
		while (parent = queue.shift()) {
			for (const [index, child] of parent.children.entries()) {
				if (child.type !== 'code') {
					continue
				}
				const { lang, meta, value, data } = child as Code
				const { hProperties = {} } = data ?? {}
				const breakpoint = hProperties['data-breakpoint'] as string | null ?? null

				// If no component is registered for the language, skip.
				const component = lang ? componentRoutes[lang] : defaultComponent
				if (!component) {
					continue
				}

				// If the meta string has `source`, skip.
				const metaTokens = meta?.split(' ') ?? []
				if (metaTokens.includes('source')) {
					child.meta = metaTokens.filter(token => token !== 'source').join(' ')
					continue
				}

				const mdx = makeElement(child, component, {
					meta: meta ?? '',
					source: value,
					breakpoint,
				})
				parent.children[index] = mdx
			}

			queue.push(...onlyParents(parent.children))
		}
	}
}
