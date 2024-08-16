import { escape as escapeXml } from '@jcayzac/utils-xml'
import type { Entry } from './entry'

interface Props {
	site: string | URL
	author: {
		name: string
		url: string | URL
	}
	title: string
	description: string
	href: string
	self: string
	current: string
	previous?: string | null
	next?: string | null
	last?: string | null
	updated: Date
	icon?: string | null
	entries: Entry[]
}

export class Feed {
	site: URL
	author: {
		name: string
		url: URL
	}

	title: string
	description: string
	updated: Date
	href: string
	entries: Entry[]
	self: string
	current: string
	previous?: string
	next?: string
	last?: string
	icon?: string

	constructor({
		site,
		author,
		title,
		description,
		updated,
		href,
		entries,
		self,
		current,
		previous,
		next,
		last,
		icon,
	}: Props) {
		this.site = new URL(site)
		this.author = {
			name: author.name,
			url: new URL(author.url, this.site),
		}
		this.title = title
		this.description = description
		this.updated = updated
		this.href = new URL(href, this.site).href
		this.entries = entries
		this.self = new URL(self, this.site).href
		this.current = new URL(current, this.site).href
		if (previous)
			this.previous = new URL(previous, this.site).href
		if (next)
			this.next = new URL(next, this.site).href
		if (last)
			this.last = new URL(last, this.site).href
		if (icon)
			this.icon = new URL(icon, this.site).href
	}

	toString() {
		return `<?xml version="1.0" encoding="utf-8"?>
		<feed xmlns="http://www.w3.org/2005/Atom" xmlns:fh="http://purl.org/syndication/history/1.0">
			<title>${escapeXml(this.title)}</title>
			<subtitle>${escapeXml(this.description)}</subtitle>
			<link href="${this.href}"/>
			<icon>/favicon.svg</icon>
			<fh:archive/>
			<link rel="self" href="${this.self}"/>
			<updated>${this.updated.toISOString()}</updated>
			<author>
				<name>${escapeXml(this.author.name)}</name>
				<uri>${escapeXml(this.author.url.href)}</uri>
			</author>
			<rights>Copyright (c) ${new Date().getFullYear()}, ${escapeXml(this.author.name)}</rights>
			<link rel="current" href="${this.current}"/>
			${(this.previous && `<link rel="prev-archive" href="${this.previous}" />`) ?? ''}
			${(this.next && `<link rel="next-archive" href="${this.next}" />`) ?? ''}
			<id>${escapeXml(this.href)}</id>
			${(this.icon && `<icon>${escapeXml(this.icon)}</icon>`) ?? ''}

			${this.entries.map(entry => entry.toString()).join('')}
		</feed>`.replace(/\n\s*/g, '')
	}
}
