import type { AstroIntegration } from 'astro'
import type { Config, PrivateConfig } from './service/config'

const name = '@jcayzac/astro-image-service-ng'

export default function integration(config: Config = {}): AstroIntegration {
	return {
		name,
		hooks: {
			'astro:config:setup': ({ config: { publicDir, outDir, build: { assets } }, updateConfig }) => {
				updateConfig({
					image: {
						service: {
							entrypoint: `${name}/service`,
							config: {
								...config,
								publicDir,
								outDir,
								assets,
							} satisfies PrivateConfig,
						},
					},
					// Note: this is needed until Astro 5 to avoid error with Markdown files
					// See https://discord.com/channels/830184174198718474/1274709819777093714
					vite: {
						build: {
							rollupOptions: {
								output: {
									manualChunks: (id: string) => id.includes(name) ? 'image-service' : undefined,
								},
							},
						},
					},
				})
			},
		},
	} satisfies AstroIntegration
}
