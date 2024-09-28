import fs from 'node:fs/promises'
import paths from 'node:path'

export async function digest(data: Uint8Array): Promise<string> {
	return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', data)))
		.map(b => b.toString(16).padStart(2, '0'))
		.join('')
}

export async function readFile(path: string): Promise<Uint8Array | undefined> {
	try {
		return await fs.readFile(path)
	}
	catch {
		return undefined
	}
}

export async function writeFile(path: string, data: Uint8Array): Promise<boolean> {
	try {
		await fs.mkdir(paths.dirname(path), { recursive: true })
		await fs.writeFile(path, data)
		return true
	}
	catch {
		return false
	}
}

export async function deleteFile(path: string): Promise<boolean> {
	try {
		// Delete entry
		await fs.unlink(path)

		// Prune empty directories
		let dir = path
		while (true) {
			const oldDir = dir
			dir = paths.dirname(oldDir)
			if (dir === oldDir) {
				break
			}

			const content = await fs.readdir(dir)
			if (content.length) {
				break
			}

			await fs.rmdir(dir)
		}
		return true
	}
	catch {
		return false
	}
}
