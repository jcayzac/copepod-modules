import { inspect } from 'node:util'
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
	propertiesToHash: ['src', 'width', 'height', 'format', 'quality'],

	validateOptions: (options, config) => {
		if (config.service.config._debug)
			globalThis.console.log(`in: validateOptions(${inspect({ options, config })})`)

		const result = baseService.validateOptions?.(options, config) ?? options

		if (config.service.config._debug)
			globalThis.console.log(`out: validateOptions(…) = ${inspect(result)}`)

		return result
	},

	getURL: (options, config) => {
		if (config.service.config._debug)
			globalThis.console.log(`in: getURL(${inspect({ options, config })})`)

		const result = baseService.getURL(options, config)

		if (config.service.config._debug)
			globalThis.console.log(`out: getURL(…) = ${inspect(result)}`)

		return result
	},

	parseURL: (url, config) => {
		if (config.service.config._debug)
			globalThis.console.log(`in: parseURL(${inspect({ url, config })})`)

		const result = baseService.parseURL(url, config)

		if (config.service.config._debug)
			globalThis.console.log(`out: parseURL(…) = ${inspect(result)}`)

		return result
	},

	getHTMLAttributes: (options, config) => {
		if (config.service.config._debug)
			globalThis.console.log(`in: getHTMLAttributes(${inspect({ options, config })})`)

		const result = baseService.getHTMLAttributes?.(options, config)

		if (config.service.config._debug)
			globalThis.console.log(`out: getHTMLAttributes(…) = ${inspect(result)}`)

		return result
	},

	getSrcSet: (options, config) => {
		if (config.service.config._debug)
			globalThis.console.log(`in: getSrcSet(${inspect({ options, config })})`)

		const result = baseService.getSrcSet?.(options, config)

		if (config.service.config._debug)
			globalThis.console.log(`out: getSrcSet(…) = ${inspect(result)}`)

		return result
	},

	async transform(inputBuffer, options, config) {
		if (config.service.config._debug)
			globalThis.console.log(`in: transform(${inspect({ options, config })})`)

		const transform: Transform = options as Transform

		if (transform.format === 'svg') {
			// FIXME: Returning the input buffer here assumes it's SVG, but it could be anything.
			// TODO: Add support for SVG image tracing.
			const result = { data: inputBuffer, format: 'svg' }

			if (config.service.config._debug)
				globalThis.console.log(`out: transform(…) = ${inspect(result)}`)

			return result
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

		if (config.service.config._debug)
			globalThis.console.log(`out: transform(…) = ${inspect({ data, format })}`)

		return {
			data,
			format,
		}
	},
} as LocalImageService<Config>

export default service
