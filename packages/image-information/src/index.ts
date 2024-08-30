import { imageSize as lookup } from 'image-size'

export interface ImageInformation {
	width: number
	height: number
	orientation?: number | undefined
	format: string
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
		if (width !== undefined && height !== undefined && type !== undefined) {
			const isPortrait = (orientation ?? 0) >= 5
			return {
				width: isPortrait ? height : width,
				height: isPortrait ? width : height,
				orientation,
				format: type,
			}
		}
	}
	// eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
	catch (_ignored) {
		// Ignore
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
