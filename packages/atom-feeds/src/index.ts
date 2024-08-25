export interface AtomEntry {
	title: string
	href: string | URL
	published: Date
	updated?: Date
	description?: string
}

export interface AtomFeed {
	site: string | URL
	author: {
		name: string
		uri: string | URL
	}
	title: string
	description: string
	href: string | URL
	updated: Date
	entries: AtomEntry[]
	self: string | URL
	current: string | URL
	previous?: string | URL | null
	next?: string | URL | null
	icon?: string | URL | null
	readMoreLabel?: string
}

export interface AtomEntrySerializeOptions {
	site: URL
	readMoreLabel?: string | undefined
}

function escape(text: string): string {
	return text.replace(/[<&]/g, c => c === '<' ? '&lt;' : '&amp;')
}

function serializeEntry(entry: AtomEntry, options: AtomEntrySerializeOptions) {
	const { title, published, description } = entry
	const { site, readMoreLabel } = options
	const href = new URL(entry.href, site).href
	const updated = entry.updated ?? published
	return `
<entry>
<title>${escape(title)}</title>
<link href="${escape(href)}" />
<id>${escape(href)}</id>
<published>${published.toISOString()}</published>
<updated>${updated.toISOString()}</updated>
${(description && `
	<summary type="html">${escape(description)}</summary>
	<content type="html">${escape(`
		<p>${description}</p>
		<p><a href="${href}">${readMoreLabel ?? 'Read More'}</a></p>
	`)}</content>
`) ?? ''}
</entry>`
}

export function serializeFeed(feed: AtomFeed) {
	const { title, description, updated, entries, readMoreLabel } = feed
	const site = new URL(feed.site)
	const href = new URL(feed.href, site).href
	const self = new URL(feed.self, site).href
	const current = new URL(feed.current, site).href
	const previous = feed.previous ? new URL(feed.previous, site).href : undefined
	const next = feed.next ? new URL(feed.next, site).href : undefined
	const icon = feed.icon ? new URL(feed.icon, site).href : undefined
	const author = {
		name: feed.author.name,
		uri: new URL(feed.author.uri, site).href,
	}

	return `<?xml version="1.0" encoding="utf-8"?>
	<feed xmlns="http://www.w3.org/2005/Atom" xmlns:fh="http://purl.org/syndication/history/1.0">
		<title>${escape(title)}</title>
		<subtitle>${escape(description)}</subtitle>
		<link href="${escape(href)}"/>
		<fh:archive/>
		<link rel="self" href="${escape(self)}"/>
		<updated>${updated.toISOString()}</updated>
		<author>
			<name>${escape(author.name)}</name>
			<uri>${escape(author.uri)}</uri>
		</author>
		<rights>Copyright (c) ${new Date().getFullYear()}, ${escape(author.name)}</rights>
		<link rel="current" href="${escape(current)}"/>
		${(previous && `<link rel="prev-archive" href="${escape(previous)}" />`) ?? ''}
		${(next && `<link rel="next-archive" href="${escape(next)}" />`) ?? ''}
		<id>${escape(href)}</id>
		${(icon && `<icon>${escape(icon)}</icon>`) ?? ''}
		${entries.map(entry => serializeEntry(entry, { site, readMoreLabel })).join('')}
	</feed>`.replace(/\n\s*/g, '')
}
