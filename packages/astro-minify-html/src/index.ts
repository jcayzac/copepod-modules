import type { AstroIntegration } from 'astro'
import { readFile, writeFile } from 'node:fs/promises'
import glob from 'fast-glob'
import { minify } from 'html-minifier-terser'

export default function integration(): AstroIntegration {
	return {
		name: '@jcayzac/astro-minify-html',
		hooks: {
			'astro:build:done': async ({ logger, dir }) => {
				let totalIn = 0
				let totalOut = 0
				const compress = async (path: string) => {
					const fullpath = `${dir.pathname}${path}`
					const content = await readFile(fullpath, 'utf-8')
					const result = await minify(content, {
						collapseWhitespace: true,
						collapseBooleanAttributes: true,
						removeComments: true,
						minifyCSS: true,
						minifyJS: true,
					})
					totalIn += content.length
					totalOut += result.length
					const percentSaved = 100 - (100 * result.length / content.length)
					if (percentSaved > 0) {
						logger.info(`${path}: -${percentSaved.toFixed(1)}%`)
						await writeFile(fullpath, result, 'utf-8')
					}
				}
				const files = await glob('**/*.html', { cwd: dir.pathname })
				await Promise.all(files.map(path => compress(path)))
				const percentSaved = 100 - (100 * totalOut / totalIn)
				logger.info(`Total: -${percentSaved.toFixed(1)}%`)
				logger.info(`Consider supporting this project. See options at https://github.com/jcayzac`)
			},
		},
	} satisfies AstroIntegration
}
