/*
 * This wraps Shiki's highlighter in order to accomplish the following:
 *
 * 1. Reuse the same lighlighter everywhere, unlike Astro which creates a new
 *    instance for each language.
 * 2. Play nicely with inline code and code blocks. By default, Shiki either
 *    wraps everything in a <pre> tag (structure: classic), or remmoves all
 *    structure, including lines (structure: inline). This implementation
 *    keeps lines but removes the <pre> and <code> tags, so that the
 *    content can be wrapped by an upstream component instead.
 * 3. Handle HTML entities in the input sent by MDX.
 *
 * The list of supported languages is based on the ones I use in my blog. New
 * languages can be added as needed. The set is typed so that languages with
 * builtin support can be tab-competed.
 */

import { type BuiltinLanguage, createHighlighter } from 'shiki'
import { transformerMetaWordHighlight } from '@shikijs/transformers'
import { JSDOM } from 'jsdom'
import theme from '@local/shiki-theme-token'
import token from '@local/shiki-transformer-token'
import autolinks from '@jcayzac/shiki-transformer-autolinks'

const langs: Set<BuiltinLanguage> = new Set([
	'ansi' as BuiltinLanguage,
	'astro',
	'bash',
	'cpp',
	'css',
	'csv',
	'diff',
	'dockerfile',
	'dotenv',
	'git-commit',
	'git-rebase',
	'go',
	'html-derivative',
	'html',
	'http',
	'ini',
	'javascript',
	'jsonc',
	'jsx',
	'markdown',
	'python',
	'scss',
	'typescript',
	'yaml',
])

const langAlias = {
	js: 'javascript',
	json: 'jsonc',
	md: 'markdown',
	py: 'python',
	sh: 'bash',
	ts: 'typescript',
} as Record<string, BuiltinLanguage>

const transformers = [
	transformerMetaWordHighlight(),
	token(),
	autolinks(),
]

const highlighter = await createHighlighter({
	langs: [...langs],
	langAlias,
	themes: [theme],
})

export interface HighlightOptions {
	lang?: string
	meta?: string
	inline?: boolean
}

function parseMetaString(str: string) {
	return Object.fromEntries(str.split(' ').reduce((prev: [string, boolean | string][], curr: string) => {
		const [key, value] = curr.split('=')
		const isNormalKey = /^[A-Z0-9]+$/i.test(key)
		if (isNormalKey)
			prev = [...prev, [key, value || true]]
		return prev
	}, []))
}

function highlight(code: string, options: HighlightOptions = {}): string {
	const lang = options.lang ?? 'plaintext'
	if (!langs.has(lang as BuiltinLanguage) && !langAlias[lang]) {
		throw new Error(`Language "${lang}" is not supported. Supported languages are:\n${[...langs].join(', ')}`)
	}

	const { meta, inline } = options
	let metaProps = {}
	if (typeof meta === 'string') {
		metaProps = {
			meta: {
				...parseMetaString(meta),
				__raw: meta,
			},
		}
	}

	// TODO:
	// - Use `codeToHast` instead of `codeToHtml`.
	// - Strip the top `<pre>` and `<code>` tags using hast.
	const highlighted = highlighter.codeToHtml(code, {
		lang,
		...metaProps,
		theme: 'token',
		defaultColor: false,
		cssVariablePrefix: '--shiki-',
		transformers,
	})

	// Extract the <code> element
	const selector = inline ? 'code > span' : 'code'
	return JSDOM.fragment(highlighted).querySelector(selector)?.innerHTML as string
}

export default highlight
