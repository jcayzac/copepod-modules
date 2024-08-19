import type { AstroIntegration } from 'astro'

function integration(): AstroIntegration {
	return {
		name: '@jcayzac/astro-image-service-ng/service',
		hooks: {
			'astro:config:setup': (options) => {
				const { config, updateConfig } = options

				let external = config.vite?.build?.rollupOptions?.external

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
								external: (source: string, importer: string | undefined, isResolved: boolean) => {
									if (source === '@jcayzac/astro-image-service-ng/service') {
										// return true
									}

									if (external === undefined) {
										return false
									}

									if (typeof external === 'function') {
										return external(source, importer, isResolved)
									}

									if (!Array.isArray(external)) {
										external = [external]
									}

									for (const e of external) {
										if (typeof e === 'string' && source === e) {
											return true
										}

										if (e instanceof RegExp && e.test(source)) {
											return true
										}
									}
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
