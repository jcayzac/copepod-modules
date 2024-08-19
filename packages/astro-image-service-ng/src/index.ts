import type { AstroIntegration } from 'astro'

function integration(): AstroIntegration {
	return {
		name: '@jcayzac/astro-image-service-ng/service',
		hooks: {
			'astro:config:setup': (options) => {
				const { updateConfig } = options
				updateConfig({
					image: {
						service: {
							entrypoint: '@jcayzac/astro-image-service-ng/service',
							config: {
								debug: true,
							},
						},
					},
				})
			},
		},
	} satisfies AstroIntegration
}

export default integration
