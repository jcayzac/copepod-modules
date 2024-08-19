import sharp, { type FormatEnum, type ResizeOptions } from 'sharp'
import type { LocalImageService } from 'astro'
import { baseService } from 'astro/assets'
import type { Config } from './config'

const qualityTable: { [k: string]: number } = {
	low: 25,
	mid: 50,
	high: 80,
	max: 100,
}

export interface Transform {
	src: string
	width?: number
	height?: number
	format: string
	quality?: string | null
}

const service: LocalImageService<Config> = {
	propertiesToHash: baseService.propertiesToHash,
	validateOptions: baseService.validateOptions,
	getURL: baseService.getURL,
	parseURL: baseService.parseURL,
	getHTMLAttributes: baseService.getHTMLAttributes,
	getSrcSet: baseService.getSrcSet,
	async transform(inputBuffer, transformOptions, config) {
		if (config.service.config._debug)
			globalThis.console.log('Made it to the transform function', { transformOptions, config })

		const transform: Transform = transformOptions as Transform

		if (transform.format === 'svg') {
			// FIXME: Returning the input buffer here assumes it's SVG, but it could be anything.
			// TODO: Add support for SVG image tracing.
			return { data: inputBuffer, format: 'svg' }
		}

		const result = sharp(inputBuffer, {
			failOnError: true,
			pages: -1,
			limitInputPixels: false,
		})

		// Adjust for EXIF data orientation
		result.rotate()

		// Resize. If the target aspect ratio is different from the source, the image is first cropped.
		if (typeof transform.width === 'number' || typeof transform.height === 'number') {
			const options: ResizeOptions = {}
			if (typeof transform.width === 'number') {
				options.width = Math.round(transform.width)
			}
			if (typeof transform.height === 'number') {
				options.height = Math.round(transform.height)
			}

			result.resize(options)
		}

		if (transform.format) {
			const quality = typeof transform.quality === 'number' ? transform.quality : qualityTable[transform.quality ?? '']
			result.toFormat(transform.format as keyof FormatEnum, { quality })
		}

		const { data, info: { format } } = await result.toBuffer({ resolveWithObject: true })
		return {
			data,
			format,
		}
	},
}

export default service
