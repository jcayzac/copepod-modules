export interface Image {
	/// URL. Can be relative to the site URL.
	url: string | URL

	/// Alt text.
	alt: string

	/// Optional caption. HTML is allowed.
	caption?: string | null | undefined
}

export interface AtomEntry {
	/// Entry title.
	title: string

	/// Entry URL. Can be relative to the site URL.
	href: string | URL

	/// Entry publication date.
	published: Date

	/// Entry update date. If not provided, `published` is used.
	updated?: Date | null | undefined

	/// Optional description. HTML is allowed.
	description?: string | null | undefined

	/// Optional image.
	image?: Image | null | undefined
}

export interface AtomFeed {
	/// Site URL.
	site: string | URL

	/// Author information.
	author: {
		name: string
		uri: string | URL
	}

	/// Feed title.
	title: string

	/// Feed description. HTML is not allowed.
	description: string

	/// Landing page URL. Can be relative to the site URL.
	href: string | URL

	/// Last update date.
	updated: Date

	/// Feed entries.
	entries: AtomEntry[]

	/// Feed self URL. Can be relative to the site URL.
	self: string | URL

	/// URL of the current page of the feed. Can be relative to the site URL.
	current: string | URL

	/// URL of the previous page of the feed. Can be relative to the site URL.
	previous?: string | URL | null | undefined

	/// URL of the next page of the feed. Can be relative to the site URL.
	next?: string | URL | null | undefined

	/// Optional feed icon. Can be relative to the site URL.
	icon?: string | URL | null | undefined

	/// Optional label for the "Read More" link. Default is "Read More". HTML is allowed.
	readMoreLabel?: string | null | undefined

	/// Optional language. Default is "en".
	lang?: string | null | undefined
}

function escape(text: string): string {
	return text.replace(/[<&]/g, c => c === '<' ? '&lt;' : '&amp;')
}

interface AtomEntrySerializeOptions {
	site: URL
	readMoreLabel?: string | null | undefined
}

function serializeEntry(entry: AtomEntry, options: AtomEntrySerializeOptions) {
	const { title, published, description, image } = entry
	const { site, readMoreLabel = 'Read More' } = options
	const href = new URL(entry.href, site).href
	const updated = entry.updated ?? published
	return `
<entry>
<title>${escape(title)}</title>
<link href="${escape(href)}" />
<link rel="alternate" type="text/html" href="${escape(href)}"/>
<id>${escape(href)}</id>
<published>${published.toISOString()}</published>
<updated>${updated.toISOString()}</updated>
${(description && `
	<content type="html">${escape(`
		${(image && `
			<figure>
				<img alt="${image.alt}" src="${new URL(image.url, site).href}" />
				${(image.caption && `<figcaption>${image.caption}</figcaption>`) ?? ''}
			</figure>
		`) ?? ''}
		<p>${description}</p>
		<p><a href="${href}">${readMoreLabel}</a></p>
	`)}
	</content>
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
	const lang = feed.lang ?? 'en'
	const author = {
		name: feed.author.name,
		uri: new URL(feed.author.uri, site).href,
	}

	return `<?xml version="1.0" encoding="utf-8"?>
	<feed xmlns="http://www.w3.org/2005/Atom" xmlns:fh="http://purl.org/syndication/history/1.0" xml:lang="${lang}">
		<title>${escape(title)}</title>
		<subtitle>${escape(description)}</subtitle>
		<link href="${escape(href)}"/>
		<fh:archive/>
		<link rel="self" href="${escape(self)}"/>
		<link rel="alternate" type="text/html" href="${escape(href)}"/>
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
