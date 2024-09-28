import { defineConfig } from 'tsup'
import common from '../../tsup.config.common'

export default defineConfig({
	...common,
	entry: [
		'src/types.ts',
		'src/index.ts',
		'src/fs-simple.ts',
	],
})
