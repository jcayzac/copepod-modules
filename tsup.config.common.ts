import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/index.ts'],
	clean: true,
	dts: true,
	format: 'esm',
	minify: false,
	sourcemap: true,
	splitting: false,
	target: 'esnext',
	tsconfig: 'tsconfig.json',
	outExtension() {
		return {
			js: `.mjs`,
		}
	},
})
