import type { AstroIntegration } from 'astro'
import type { Config } from './service/config'

function integration(config: Config): AstroIntegration {
	return {
		name: '@jcayzac/astro-image-service-ng/service',
		hooks: {
			'astro:config:setup': (options) => {
				const { updateConfig } = options

				updateConfig({
					image: {
						service: {
							entrypoint: '@jcayzac/astro-image-service-ng/service',
							config,
						},
					},
					// Note: this is needed until Astro 5 to avoid error with Markdown files
					// See https://discord.com/channels/830184174198718474/1274709819777093714
					vite: {
						build: {
							rollupOptions: {
								output: {
									manualChunks: (id: string) => {
										if (/\/@jcayzac\/astro-image-service-ng\b/.test(id)) {
											return 'image-service'
										}
									},
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
