import type { Link, Parent } from 'mdast'

export interface LinkTransform {
	readonly name: string
	readonly detect: RegExp
	readonly groups?: (string | undefined)[]
	readonly transform: (link: Link, ...captured: (string | undefined)[]) => Parent | undefined
}
