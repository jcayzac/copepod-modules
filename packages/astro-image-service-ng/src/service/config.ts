import type { ImageTransform, LocalImageService } from 'astro'
import type { HTMLAttributes } from 'astro/types'

export interface Config {
	/**
	 * Default values for image transforms. Can be overridden by each transform.
	 * @default undefined
	 */
	defaults?:
		| undefined
		| {
			/**
			 * Output format to use when none is specified in the transform.
			 * @default 'avif'
			 */
			'format'?: 'avif' | 'webp' | undefined

			/**
			 * For any image transform that specifies neither `widths`, `densities` nor
			 * `autoscale:list`, the service defaults to this autoscale list, unless
			 * `sizes` is also specified (and not falsy).
			 * @default undefined
			 */
			'autoscale:list'?: number[] | undefined
		}
}

export interface PrivateConfig extends Config {
	publicDir?: URL | string
	outDir?: URL | string
	assets?: string
}

export type LocalImageServiceConfig = Parameters<LocalImageService<PrivateConfig>['transform']>[2]
export type TransformOutput = ReturnType<LocalImageService<PrivateConfig>['transform']>

export interface Transform extends Omit<HTMLAttributes<'img'>, 'height' | 'width' | 'src'>, ImageTransform {
	/**
	 * Array of values, in percents, controlling the automatic generation of the
	 * `sizes` and `srcset` attributes for the image.
	 *
	 * Each value is a percentage of the image's intrinsic size. `0` is not
	 * allowed and, if present, will be ignored. Negative values and values
	 * greater than `100` are ignored.
	 *
	 * @example `[12.5, 25, 37.7, 50, 62.5, 75, 87.5]`
	 * @default undefined (no automatic sizes)
	 */
	'autoscale:list'?: number[] | undefined
}

export interface ResolvedTransform extends Omit<Transform, 'src'> {
	src: string
}
