import type { Link, Parent } from 'mdast'
import type { LinkTransform } from './transform'
import 'mdast-util-to-hast'

export const codepen: LinkTransform = {
	name: 'codepen',
	detect: /^https:\/\/codepen\.io\/([^/]+)\/(?:pen|embed|embed\/preview)\/([^?/]+)(?:\?(.+))?/,
	groups: ['owner', 'pen', 'query'],
	transform: function (link: Link, owner: string, pen: string): Parent | undefined {
		const url = new URL(link.url)
		url.pathname = `/${owner}/embed/preview/${pen}`
		if (!url.searchParams.has('default-tab')) {
			url.searchParams.set('default-tab', 'html,result')
		}
		return {
			type: 'blockquote',
			position: link.position,
			children: [],
			data: {
				hName: 'div',
				hProperties: {
					style: 'resize:both;overflow:auto;display:flex;min-height:20rem',
				},
				hChildren: [
					{
						type: 'element',
						tagName: 'iframe',
						children: [],
						properties: {
							src: url.href,
							title: link.title || 'CodePen Embed',
							style: 'border:0;width:100%;height:100%;min-height:20rem',
							frameborder: '0',
							scrolling: 'no',
							allowfullscreen: true,
							allowtransparency: true,
							loading: 'lazy',
						},
					},
				],
			},
		} satisfies Parent
	} as LinkTransform['transform'],
}
