/* eslint-disable antfu/no-import-node-modules-by-path */
/* eslint-disable antfu/no-import-dist */
import type { FormatEnum, ResizeOptions } from 'sharp'
import sharp from 'sharp'

import type { LocalImageService } from 'astro'
import type { ImageOutputFormat } from '../../node_modules/astro/dist/assets/types.d.ts'
import type { BaseServiceTransform } from '../../node_modules/astro/dist/assets/services/service.d.ts'
import { baseService } from '../../node_modules/astro/dist/assets/services/service.js'

interface Config {
	// Keep
}

const sharpService: LocalImageService<Config> = {
	propertiesToHash: baseService.propertiesToHash,
	validateOptions: baseService.validateOptions,
	getURL: baseService.getURL,
	parseURL: baseService.parseURL,
	getHTMLAttributes: baseService.getHTMLAttributes,
	getSrcSet: baseService.getSrcSet,
	async transform(inputBuffer, transformOptions, _config) {
		const transform: BaseServiceTransform = transformOptions as BaseServiceTransform

		// Return SVGs as-is
		// FIXME: This assumes the input buffer is an SVG.
		// TODO: Sharp has some support for SVGs, we could probably support this once Sharp is the default and only service.
		if (transform.format === 'svg')
			return { data: inputBuffer, format: 'svg' }

		const result = sharp(inputBuffer, {
			failOnError: true,
			pages: -1,
			limitInputPixels: false,
		})

		// always call rotate to adjust for EXIF data orientation
		result.rotate()

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
			const quality = typeof transform.quality === 'number' ? transform.quality : undefined
			result.toFormat(transform.format as keyof FormatEnum, { quality })
		}

		const { data, info } = await result.toBuffer({ resolveWithObject: true })

		return {
			data,
			format: info.format as ImageOutputFormat,
		}
	},
}

export default sharpService
