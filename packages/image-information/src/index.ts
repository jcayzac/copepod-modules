import { imageSize as lookup } from 'image-size'

export interface ImageInformation {
	/// Intrinsic width of the image.
	width: number

	/// Intrinsic height of the image.
	height: number

	/// EXIF orientation, if available.
	orientation?: number | undefined

	/// Inferred file extension, e.g 'avif' or 'png'.
	extension: string

	/// Inferred MIME type, e.g 'image/avif' or 'image/png'.
	type: string
}

const SUPPORTED_TYPES = new Set([
	'avif',
	'gif',
	'heic',
	'heif',
	'j2c',
	'jp2',
	'jpeg',
	'jpg',
	'png',
	'svg',
	'webp',
])

const MIME_TYPES: Record<string, string> = {
	jpg: 'image/jpeg',
	svg: 'image/svg+xml',
}

/**
 * Probe information about an image.
 *
 * @param buffer Image data. Does not need to be the entire file.
 * @returns Image information, if found.
 */
export function probe(buffer: Uint8Array): ImageInformation | undefined {
	try {
		const { width, height, orientation, type } = lookup(buffer)
		if (width !== undefined && height !== undefined && type !== undefined && SUPPORTED_TYPES.has(type)) {
			const isPortrait = (orientation ?? 0) >= 5
			return {
				width: isPortrait ? height : width,
				height: isPortrait ? width : height,
				orientation,
				extension: type,
				type: MIME_TYPES[type] ?? `image/${type}`,
			}
		}
	}
	catch (ignored) {
		void ignored
	}

	return undefined
}

/**
 * Try to get information about an image.
 *
 * @param url URL of the image to probe. Can be a file or remote URL.
 * @returns Image information, if found.
 * @throws {Error} If an IO error happens while fetching the URL.
 */
export async function imageInformation(url: URL | string): Promise<ImageInformation | undefined> {
	url = url instanceof URL ? url : new URL(url)

	try {
		const { ok, body } = await fetch(url)
		if (!body || !ok) {
			return undefined
		}

		const reader = body.getReader()
		let buffer = new Uint8Array()
		while (true) {
			const { done, value } = await reader.read()
			if (done) {
				return undefined
			}

			const tmp = new Uint8Array(buffer.length + value.length)
			tmp.set(buffer)
			tmp.set(value, buffer.length)
			buffer = tmp

			const result = probe(buffer)
			if (result) {
				await reader.cancel()
				return result
			}
		}
	}
	catch (error) {
		const { name } = error as Error
		if (url.protocol === 'file:' && name === 'TypeError') {
			// Node's fetch() doesn't support file:// URLs. Lame.
			const { readFile } = await import('node:fs/promises')
			return probe(await readFile(url))
		}
		else {
			throw error
		}
	}
}
