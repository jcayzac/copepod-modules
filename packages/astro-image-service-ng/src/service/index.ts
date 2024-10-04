import type { ImageMetadata, LocalImageService } from 'astro'
import type { LocalImageServiceConfig, PrivateConfig, ResolvedTransform, Transform } from './config'
import assert from 'node:assert'
import { imageInformation } from '@jcayzac/image-information'
import { baseService } from 'astro/assets'
import { AstroError } from 'astro/errors'
import sharp from 'sharp'
import { optimize as svgo } from 'svgo'

// Keep for compatibility with Astro documentation
// See https://docs.astro.build/en/guides/images/#quality
const qualityTable: { [k: string]: number } = {
	low: 50,
	mid: 70,
	high: 80,
	max: 100, // lossless
}

const service: LocalImageService<PrivateConfig> = {
	// Caution: do not add here properties that only matter for srcsets,
	// like `widths`, `autoscale:list` or `densities`.
	propertiesToHash: ['src', 'width', 'height', 'format', 'quality'],

	validateOptions: async (options: Transform, config: LocalImageServiceConfig) => {
		// Check that the integration was used
		const { src } = options
		const { publicDir, assets, outDir, defaults = {} } = config.service.config

		if (!publicDir || !assets || !outDir) {
			throw new AstroError(`This image service cannot be used directly, you must use the provided Astro integration!`)
		}

		if (typeof src === 'string') {
			// Not an ESM-imported image
			const isAbsoluteURL = /^(?:\w+:)?\/\//.test(src) // absolute (maybe protocol-relative) URLs
			const isPublicAsset = /^\/(?![@/])/.test(src) // all /… except /@… and //…
			const isBundledAsset = src.startsWith(`/${assets}/`) // /_astro/…
			if (!isAbsoluteURL && !isBundledAsset && !isPublicAsset) {
				throw new AstroError(`Local image not correctly imported: "${src}"`)
			}

			if (!options.width || !options.height) {
				// Try inferring intrinsic dimensions from the image
				let url: URL | undefined
				if (isAbsoluteURL) {
					// Handle protocol-relative URLs as https://
					url = src.startsWith('//') ? new URL(`https://${src}`) : new URL(src)
				}
				else if (isBundledAsset) {
					// Look into dist/_astro
					url = new URL(src, outDir)
				}
				else {
					assert.ok(isPublicAsset)
					// Look into public/
					url = new URL(src, publicDir)
				}
				const info = await imageInformation(url)
				if (info) {
					// Instead of setting options.width and options.height,
					// let's just turn src into an ImageMetadata object so
					// that target dimensions can be calculated later.
					options.src = {
						src,
						width: info.width,
						height: info.height,
						// FIXME: is this safe?
						format: info.type as ImageMetadata['format'],
					}
					if (info.orientation !== undefined) {
						options.src.orientation = info.orientation
					}
				}
				else {
					// Couldn't infer dimensions :-/
					throw new AstroError(`\`width\` and \`height\` must be specified for "${src}"`)
				}
			}
		}
		else if (isImageMetadata(src)) {
			if (src.format === 'svg' && options.format === undefined) {
				// Default output format for SVG is SVG
				options.format = 'svg'
			}
			else if (src.format !== 'svg' && options.format === 'svg') {
				// Non-SVG input cannot be converted to SVG
				throw new AstroError(`Cannot transform from "${src.format}" to "svg"`)
			}
		}
		else if (!src) {
			throw new AstroError(`\`src\` is missing`)
		}
		else {
			throw new AstroError(`Expected \`src\` to be of type \`string | ImageMetadata\`, but got \`${typeof src}\` instead`)
		}

		let mutuallyExclusive = 0
		if (options.densities) {
			mutuallyExclusive += 1
		}
		if (options.widths) {
			mutuallyExclusive += 1
		}
		if (options['autoscale:list']) {
			mutuallyExclusive += 1
		}
		if (mutuallyExclusive > 1) {
			throw new AstroError(`\`densities\`, \`widths\` and \`autoscale:list\` are mutually-exclusive`)
		}

		if (options.format !== 'svg' && !options.sizes && !options.widths && !options.densities && !options['autoscale:list']) {
			options['autoscale:list'] = defaults['autoscale:list']
		}

		if (options['autoscale:list']) {
			if (options.format === 'svg') {
				throw new AstroError(`\`autoscale:list\` cannot be used with SVG images`)
			}
			if (options.sizes) {
				throw new AstroError(`\`sizes\` cannot be specified if \`autoscale:list\` is used`)
			}
			if (!Array.isArray(options['autoscale:list']) || options['autoscale:list'].some(value => typeof value !== 'number')) {
				throw new AstroError(`\`autoscale:list\` must be an array of numbers`)
			}
			options['autoscale:list'] = options['autoscale:list'].filter(value => value > 0 && value < 100)
		}

		if (options.width) {
			options.width = Math.round(options.width)
		}

		if (options.height) {
			options.height = Math.round(options.height)
		}

		if (!options.format) {
			options.format = defaults.format ?? 'avif'
		}
		else if (options.format === 'jpg') {
			options.format = 'jpeg'
		}

		return options
	},

	getURL: async (options: Transform, config: LocalImageServiceConfig) => {
		// Grab the image endpoint's path from the base service
		let base = baseService.getURL(options, config)
		if (base instanceof Promise) {
			base = await base
		}
		// normalize and remove the query string
		const path = new URL(base, 'http://localhost').pathname

		// Build our query string
		const query = new URLSearchParams()
		query.append('href', typeof options.src === 'string' ? options.src : options.src.src)

		if (options.width) {
			query.append('w', `${options.width}`)
		}

		if (options.height) {
			query.append('h', `${options.height}`)
		}

		if (options.quality) {
			query.append('q', `${options.quality}`)
		}

		if (options.format) {
			query.append('f', options.format)
		}

		if (options['autoscale:list']) {
			query.append('autoscale', options['autoscale:list'].join(','))
		}

		return `${path}?${query}`
	},

	parseURL: ({ searchParams: query }, _config: LocalImageServiceConfig) => {
		const src = query.get('href')
		if (!src) {
			return undefined
		}

		const width = query.get('w')
		const height = query.get('h')
		const quality = query.get('q')
		const format = query.get('f')
		const autoscale = query.get('autoscale')?.split(',')?.map(value => Number.parseFloat(value))

		return {
			src,
			'width': width ? Number.parseInt(width, 10) : undefined,
			'height': height ? Number.parseInt(height, 10) : undefined,
			quality,
			format,
			'autoscale:list': autoscale,
		}
	},

	getHTMLAttributes: (options: Transform, _config: LocalImageServiceConfig) => {
		const { width, height } = getTargetDimensions(options)

		const {
			src: _src,
			width: _width,
			height: _height,
			format: _format,
			formats: _formats,
			quality: _quality,
			densities: _densities,
			widths: _widths,
			'autoscale:list': autoscale,
			loading = 'lazy',
			decoding = 'async',
			...attributes
		} = options

		const result: Record<string, any> = {
			...attributes,
			width,
			height,
			loading,
			decoding,
		}

		// Generate the `sizes` attribute if `autoscale:list` is used
		if (autoscale && width) {
			result.sizes = `${autoscale.map((value) => {
				const w = Math.round(width * value / 100)
				return `(width <= ${w}px): ${w}px`
			}).join(', ')},${width}px`
		}

		return result
	},

	getSrcSet: (options: Transform, _config: LocalImageServiceConfig) => {
		const format = options.format ?? 'avif'
		const mimeType = ({
			svg: 'image/svg+xml',
			ico: 'image/vnd.microsoft.icon',
		} as Record<string, string>)[format] ?? `image/${format}`

		const [imageWidth, maxWidth]
			= (typeof options.src === 'string'
				? [options.width, Infinity]
				: [options.src.width, options.src.width]) as [number, number]

		const allWidths = []
		const { widths, densities, 'autoscale:list': autoscaleList } = options
		if (densities) {
			const { width } = getTargetDimensions(options)
			if (width !== undefined) {
				const densityValues = densities.map(density => typeof density === 'number' ? density : Number.parseFloat(density)).sort()
				allWidths.push(
					...densityValues.map((density, index) => ({
						width: Math.min(Math.round(width * density), maxWidth),
						descriptor: `${densityValues[index]}x`,
					})),
				)
			}
		}
		else if (widths) {
			allWidths.push(
				...widths.map(width => ({
					width: Math.min(width, maxWidth),
					descriptor: `${width}w`,
				})),
			)
		}
		else if (Array.isArray(autoscaleList)) {
			const { width } = getTargetDimensions(options)
			if (width !== undefined) {
				allWidths.push(
					...autoscaleList.map((autoscale) => {
						const w = Math.round(width * autoscale / 100)
						return {
							width: Math.min(w, maxWidth),
							descriptor: `${w}w`,
						}
					}),
				)

				allWidths.push({
					width,
					descriptor: `${width}w`,
				})
			}
		}

		const {
			width: _ignoredWidth,
			height: _ignoredHeight,
			...transformWithoutDimensions
		} = options

		return allWidths.reduce<any>((srcSet, { width, descriptor }) => {
			const srcSetTransform = { ...transformWithoutDimensions }

			if (width !== imageWidth) {
				srcSetTransform.width = width
			}
			else if (options.width && options.height) {
				srcSetTransform.width = options.width
				srcSetTransform.height = options.height
			}

			srcSet.push({
				transform: srcSetTransform,
				descriptor,
				attributes: {
					type: mimeType,
				},
			})

			return srcSet
		}, [])
	},

	async transform(inputBuffer, transform: ResolvedTransform, _config: LocalImageServiceConfig) {
		// validateOptions() currently guarantees that inputBuffer is an SVG
		// if "format" is "svg", so we can safely assume that here.
		if (transform.format === 'svg') {
			const { data } = svgo(new TextDecoder().decode(inputBuffer), {
				multipass: true,
			})
			return {
				data: new TextEncoder().encode(data),
				format: 'svg',
			}
		}

		// Initialize sharp with the input buffer.
		const result = sharp(inputBuffer, {
			failOn: 'error',
			pages: -1, // convert all pages
			limitInputPixels: false,
		})

		const metadata = await result.metadata()
		const colorspace = (metadata.space ?? 'srgb') as string
		const isHdr = colorspace === 'rgb16'
		const icc = metadata.icc

		// Always call rotate() first to ensure that the image is properly oriented.
		result.rotate()

		// Resize, allowing the image ratio to change if requested.
		if (typeof transform.width === 'number' || typeof transform.height === 'number') {
			const params: sharp.ResizeOptions = {}
			if (typeof transform.width === 'number') {
				params.width = Math.round(transform.width)
			}
			if (typeof transform.height === 'number') {
				params.height = Math.round(transform.height)
			}
			result.resize(params)
		}

		// Convert to the requested format.
		if (transform.format) {
			// TODO: use metadata to determine if the image is HDR, and if so, set
			// the pipeline colorspace to 'rgb16' and the metadata to 'icc: p3'.
			//
			let options: any = {}

			// Only override Sharp's default quality if a value is provided.
			const quality = typeof transform.quality === 'number' ? transform.quality : qualityTable[transform.quality ?? '']
			if (quality !== undefined) {
				options.quality = quality
			}

			if (isHdr && transform.format !== 'png') {
				console.warn(`Warning: Sharp does not support writing HDR .${transform.format} images. Converting to SDR…`)
			}

			// Set some sane defaults.
			switch (transform.format) {
				case 'avif':
					options = {
						...options,
						bitdepth: 8,
						lossless: options.quality === 100,
						// effort: 9, // too slow!
					} satisfies sharp.AvifOptions
					break

				case 'webp':
					options = {
						...options,
						lossless: options.quality === 100,
						// effort: 6, // too slow!
					} satisfies sharp.WebpOptions
					break

				case 'png':
					options = {
						...options,
						// compressionLevel: 9, // too slow!
					} satisfies sharp.PngOptions
					break

				case 'jpeg':
					options = {
						...options,
						mozjpeg: true,
					} satisfies sharp.JpegOptions
					break
			}

			result.toFormat(transform.format, options)
		}

		if (isHdr && transform.format === 'png') {
			// Only PNG supports HDR images for now
			result.pipelineColorspace('rgb16')
		}

		if (icc) {
			result.keepIccProfile()
		}

		const { data, info: { format } } = await result.toBuffer({
			resolveWithObject: true,
		})
		return {
			data,
			format,
		}
	},
}

export default service

function isImageMetadata(src: any): src is ImageMetadata {
	return typeof src === 'object' && typeof src.src === 'string' && 'width' in src && 'height' in src && 'format' in src
}

function getTargetDimensions({ width, height, src }: Transform) {
	if ((!width || !height) && isImageMetadata(src)) {
		const { width: sw, height: sh } = src
		const ratio = sw / sh
		width ||= Math.round((height || sh) * ratio)
		height ||= Math.round((width || sw) / ratio)
	}
	return { width, height }
}
