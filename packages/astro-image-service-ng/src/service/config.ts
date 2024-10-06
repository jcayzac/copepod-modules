import type { ImageTransform, LocalImageService } from 'astro'
import type { FitEnum } from 'sharp'

export interface Config {
	/**
	 * Format to use When no output format is specified.
	 * @default 'avif'
	 */
	defaultFormat?: 'avif' | 'webp' | undefined

	/**
	 * [`@copepod/kv`](https://www.npmjs.com/package/@copepod/kv) store identifier to cache transformed images with.
	 * @default undefined
	 */
	kv?: string | undefined
}

export interface PrivateConfig extends Config {
	publicDir?: URL | string
	outDir?: URL | string
	assets?: string
	command?: string
}

export type LocalImageServiceConfig = Parameters<LocalImageService<PrivateConfig>['transform']>[2]
export type TransformOutput = ReturnType<LocalImageService<PrivateConfig>['transform']>

export interface Transform extends ImageTransform {
	alt?: string | undefined
	index?: number | undefined
	title?: string | undefined
	sizes?: string | undefined

	/**
	 * Fitting algorithm to use when resizing images.
	 *
	 * Possible values are `cover`, `contain`, `fill`, `inside`, `outside`.
	 *
	 * @see [here](https://sharp.pixelplumbing.com/api-resize) for a detailed description.
	 *
	 * @default `cover`
	 */
	fit?: keyof FitEnum | undefined
}

export interface ResolvedTransform extends Omit<Transform, 'src'> {
	src: string
}
