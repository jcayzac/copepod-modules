import type { Root } from 'hast'
import type { Options as KatexOptions } from 'rehype-katex'
import katex from 'rehype-katex'
import { baseline, type BaselineOptions } from './baseline'

export interface PresetOptions {
	baseline?: BaselineOptions | undefined
	katex?: KatexOptions | undefined
}

interface Options { [key: string]: any }
type Factory = (options: Options) => (root: Root) => void

export function plugins(options: PresetOptions = {}) {
	return [
		[katex, options.katex ?? {}],
		[baseline, options.baseline ?? {}],
	] as [Factory, Options][]
}
