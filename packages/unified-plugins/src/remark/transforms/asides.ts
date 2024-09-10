import type { Paragraph, Parent, Text } from 'mdast'
import type { AnyData } from '../utils'

/**
 * Support for asides.
 *
 * ```md
 * > [!NOTE: This is a note]
 * > This is the content of the note.
 *
 * > [!WARNING]
 * > This is a warning.
 * ```
 */
export function asides(parent: Parent) {
	if (parent.type !== 'blockquote' || parent.children[0]?.type !== 'paragraph') {
		return
	}

	const paragraph = parent.children[0] as Paragraph
	if (paragraph.children[0]?.type !== 'text') {
		return
	}

	const text = paragraph.children[0] as Text

	// Extract the inner content of [!…]
	const [full, args] = /^\s*\[!([^\]]+)\]\s*/.exec(text.value) || []
	if (!full || !args) {
		return
	}

	// Remove the [!…] from the text
	// Note: This has the effect of trimming the start of the paragraph
	text.value = text.value.slice(full.length)

	// Parse the type and title
	// eslint-disable-next-line regexp/no-super-linear-backtracking
	const match = /^\s*([A-Z][A-Z_]*)(?::\s+([^\]]+))?$/.exec(args)
	if (!match) {
		return
	}
	const type = match[1]!.toLowerCase()
	const title = match[2]?.trim() ?? `${match[1]![0]}${type.slice(1).replace(/_/g, ' ')}`
	const { data } = parent as AnyData
	parent.data = {
		...data,
		hName: 'aside',
		hProperties: {
			...data?.hProperties,
			className: ['aside', `aside-${type}`],
			type,
			title,
			dataTitle: title,
		},
	}
}
