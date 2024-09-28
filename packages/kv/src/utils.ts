export async function digest(data: Uint8Array): Promise<string> {
	return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', data)))
		.map(b => b.toString(16).padStart(2, '0'))
		.join('')
}
