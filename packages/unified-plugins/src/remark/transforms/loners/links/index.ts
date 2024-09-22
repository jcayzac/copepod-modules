import type { Link } from 'mdast'
import type { MdxJsxFlowElement, MdxJsxFlowElementData } from 'mdast-util-mdx-jsx'
import type { LinkTransform } from './transform'
import { nodeToString } from '../../../utils'
import { codepen } from './codepen'
import { youtube } from './youtube'

export * from './codepen'
export * from './transform'
export * from './youtube'

const DEFAULT_TRANSFORMS: LinkTransform[] = [
	youtube,
	codepen,
]

export interface LinkOptions {
	readonly transforms?: LinkTransform[]
	readonly defaultComponent?: string | undefined
	readonly componentRoutes?: Record<string, string> | undefined
}

export function processLink(link: Link, options: LinkOptions) {
	for (const { name, detect, transform, groups } of [
		...DEFAULT_TRANSFORMS,
		...options.transforms ?? [],
	]) {
		const match = detect.exec(link.url)
		if (!match) {
			continue
		}

		const args = match.slice(1) as Array<string | undefined>

		// Links utually don't have a title, only child nodes.
		if (!link.title) {
			const title = nodeToString(link).trim()
			if (title) {
				link.title = title
			}
		}

		// Replace the link with the transformed node
		const component = options.componentRoutes?.[name] ?? options.defaultComponent
		if (!component) {
			return transform(link, ...args)
		}

		// Route the loner to an MDX  component, passing not only the url and title as props,
		// but also all the captured groups from the regex.
		const mdx = {
			type: 'mdxJsxFlowElement',
			name: component,
			children: link.children,
			position: link.position,
			data: { _mdxExplicitJsx: true } as MdxJsxFlowElementData,
			attributes: [
				{
					type: 'mdxJsxAttribute',
					name: 'url',
					value: link.url,
				},
				{
					type: 'mdxJsxAttribute',
					name: 'args',
					value: {
						type: 'mdxJsxAttributeValueExpression',
						value: `[${args.map(value => value ? JSON.stringify(value) : 'undefined').join(', ')}]`,
						data: {
							estree: {
								type: 'Program',
								body: [
									{
										type: 'ExpressionStatement',
										expression: {
											type: 'ArrayExpression',
											elements: args.map(value => value ? { type: 'Literal', value, raw: JSON.stringify(value) } : { type: 'Identifier', name: 'undefined' }),
										},
									},
								],
								sourceType: 'module',
							},
						},
					},
				},
			],
		} as MdxJsxFlowElement

		if (link.title) {
			mdx.attributes.push({
				type: 'mdxJsxAttribute',
				name: 'title',
				value: link.title,
			})
		}

		// If the transform names any group, pass them as props
		for (const [index, name] of groups?.entries() ?? []) {
			const value = args[index]
			if (typeof name === 'string' && typeof value === 'string') {
				mdx.attributes.push({ type: 'mdxJsxAttribute', name, value })
			}
		}

		return mdx
	}

	return undefined
}
