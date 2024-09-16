import type { Link, Parent } from 'mdast'
import type { LinkTransform } from './transform'

export const codepen: LinkTransform = {
	name: 'codepen',
	detect: /^https:\/\/codepen\.io\/([^/]+)\/pen\/([^/]+)/,
	groups: ['owner', 'pen'],
	transform: function (link: Link, owner: string, pen: string): Parent | undefined {
		const url = new URL(`https://codepen.io/${owner}/embed/${pen}`)
		url.searchParams.set('default-tab', 'html,result')
		const element = {
			type: 'image',
			url: url.href,
			title: link.title || 'YouTube video player',
			position: link.position,
			children: [],
			data: {
				hName: 'iframe',
				hProperties: {
					height: '25vh',
					style: 'border:0;width:100%;min-width:20rem;max-width:80rem;min-height:20rem;',
					frameborder: '0',
					scrolling: 'no',
					allowfullscreen: null,
					allowtransparency: null,
					loading: 'lazy',
				},
			},
		}

		return element
	} as LinkTransform['transform'],
}
