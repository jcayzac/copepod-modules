import type { Root } from 'mdast'
import type { Options as MathOptions } from 'remark-math'
import math from 'remark-math'
import { baseline, type BaselineOptions } from './baseline'

export interface PresetOptions {
	baseline?: BaselineOptions | undefined
	math?: MathOptions | undefined
}

interface Options { [key: string]: any }
type Factory = (options: Options) => (root: Root) => void

export function plugins(options: PresetOptions = {}) {
	return [
		[math, options.math ?? {}],
		[baseline, options.baseline ?? {}],
	] as [Factory, Options][]
}
