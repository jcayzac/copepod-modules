import { escape as escapeXml } from '@jcayzac/utils-xml'

interface Props {
	title: string
	href: string
	published: Date
	updated?: Date
	description?: string
}

export class Entry {
	title: string
	href: string
	published: Date
	updated: Date
	description?: string

	constructor({ title, href, published, updated, description }: Props) {
		this.title = title
		this.href = new URL(href, import.meta.env.SITE).href
		this.published = published
		this.updated = updated ?? published
		this.description = description ?? undefined
	}

	toString() {
		return `
<entry>
  <title>${escapeXml(this.title)}</title>
  <link href="${escapeXml(this.href)}" />
  <id>${escapeXml(this.href)}</id>
	<published>${this.published.toISOString()}</published>
  <updated>${this.updated.toISOString()}</updated>
  ${(this.description && `
		<summary type="html">${escapeXml(this.description)}</summary>
		<content type="html">${escapeXml(`<p>${this.description}</p> <p><a href="${this.href}">Read full article on copepod.dev</a></p>`)}</content>
	`) ?? ''}
</entry>`
	}
}
