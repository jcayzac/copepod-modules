import type { Link, Parent } from 'mdast'
import type { LinkTransform } from './transform'

export const youtube: LinkTransform = {
	name: 'youtube',
	detect: /^https:\/\/(?:youtu\.be\/|(?:.+\.)?youtube\.com\/watch\?(?:[^&]+&)*v=)([^?&/]+)/,
	groups: ['id'],
	transform: function (link: Link, id: string): Parent | undefined {
		const url = new URL(link.url)
		const t = url.searchParams.get('t')
		if (t) {
			url.searchParams.set('start', t)
			url.searchParams.delete('t')
		}
		url.hostname = 'www.youtube-nocookie.com'
		url.pathname = `/embed/${id}`

		const element = {
			type: 'image',
			url: url.href,
			title: link.title || 'YouTube video player',
			position: link.position,
			children: [],
			data: {
				hName: 'iframe',
				hProperties: {
					width: '560',
					height: '315',
					style: 'border:0;width:100%;height:auto;aspect-ratio:16/9',
					frameborder: '0',
					allow: 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
					referrerpolicy: 'strict-origin-when-cross-origin',
					allowfullscreen: true,
					loading: 'lazy',
				},
			},
		}

		return element
	} as LinkTransform['transform'],
}
