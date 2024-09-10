import type { Root } from 'mdast'
import math from 'remark-math'
import type { Options as MathOptions } from 'remark-math'
import { type BaselineOptions, baseline } from './baseline'

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
