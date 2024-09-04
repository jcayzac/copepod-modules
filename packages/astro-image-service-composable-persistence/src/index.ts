import type { AstroIntegration } from 'astro'

export interface Config {
	service: {
		entrypoint: string
		config: Record<string, any>
	}
	storage: {
		entrypoint: string
		config: Record<string, any>
	}
}

export default function integration(config: Config): AstroIntegration {
	return {
		name: '@jcayzac/astro-image-service-composable-persistence',
		hooks: {
			'astro:config:setup': ({ updateConfig }) => {
				updateConfig({
					image: {
						service: {
							entrypoint: '@jcayzac/astro-image-service-composable-persistence/service',
							config,
						},
					},
				})
			},
		},
	} satisfies AstroIntegration
}
