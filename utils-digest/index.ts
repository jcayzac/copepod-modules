/**
 * Returns the SHA-256 digest of the given data as a hex string.
 *
 * @param data The buffer to digest.
 */
async function digest(data: Uint8Array): Promise<string> {
	return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', data)))
		.map(b => b.toString(16).padStart(2, '0'))
		.join('')
}

export default digest
