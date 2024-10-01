import type { AstroIntegration } from 'astro'
import type { Config, PrivateConfig } from './service/config'

export default function integration(config: Config = {}): AstroIntegration {
	return {
		name: '@jcayzac/astro-image-service-ng',
		hooks: {
			'astro:config:setup': ({ config: { publicDir, outDir, build: { assets } }, command, updateConfig }) => {
				updateConfig({
					image: {
						service: {
							entrypoint: '@jcayzac/astro-image-service-ng/service',
							config: {
								...config,
								publicDir,
								outDir,
								assets,
								command,
							} satisfies PrivateConfig,
						},
					},
					// Note: this is needed until Astro 5 to avoid error with Markdown files
					// See https://discord.com/channels/830184174198718474/1274709819777093714
					vite: {
						build: {
							rollupOptions: {
								output: {
									manualChunks: (id: string) => {
										const separate = /\/@jcayzac\/astro-image-service-ng\b/.test(id)
										return separate ? 'image-service' : undefined
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
