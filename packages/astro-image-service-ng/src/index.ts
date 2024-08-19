import type { AstroIntegration } from 'astro'
import type { Rollup, Plugin as VitePlugin } from 'vite'

// eslint-disable-next-line ts/no-unsafe-function-type
type OutputOptionsHook = Extract<VitePlugin['outputOptions'], Function>
type OutputOptions = Parameters<OutputOptionsHook>[0]

interface ExtendManualChunksHooks {
	before?: Rollup.GetManualChunk
	after?: Rollup.GetManualChunk
}

export function extendManualChunks(outputOptions: OutputOptions, hooks: ExtendManualChunksHooks) {
	const manualChunks = outputOptions.manualChunks
	outputOptions.manualChunks = function (id: any, meta: any) {
		if (hooks.before) {
			const value = hooks.before(id, meta)
			if (value) {
				return value
			}
		}

		// Defer to user-provided `manualChunks`, if it was provided.
		if (typeof manualChunks == 'object') {
			if (id in manualChunks) {
				const value = manualChunks[id]
				return value?.[0] ?? null
			}
		}
		else if (typeof manualChunks === 'function') {
			const outid = manualChunks.call(this, id, meta)
			if (outid) {
				return outid
			}
		}

		if (hooks.after) {
			return hooks.after(id, meta) || null
		}
		return null
	}
}

function integration(): AstroIntegration {
	return {
		name: '@jcayzac/astro-image-service-ng/service',
		hooks: {
			'astro:config:setup': (options) => {
				const { config, updateConfig } = options

				let output = config.vite?.build?.rollupOptions?.output || {}
				if (Array.isArray(output)) {
					output = Object.fromEntries(output.flatMap(Object.entries))
				}
				extendManualChunks(output, {
					after: (id: string) => {
						if (id.includes('@jcayzac/astro-image-service-ng')) {
							return 'image-service'
						}
					},
				})

				updateConfig({
					image: {
						service: {
							entrypoint: '@jcayzac/astro-image-service-ng/service',
							config: {
								debug: true,
							},
						},
					},
					vite: {
						...(config.vite || {}),
						build: {
							...(config.vite?.build || {}),
							rollupOptions: {
								...(config.vite?.build?.rollupOptions || {}),
								output: {
									...(config.vite?.build?.rollupOptions?.output || {}),
									manualChunks: output.manualChunks,
								},
							},
						},
					},
				})
			},
		},
	} satisfies AstroIntegration
}

export default integration
