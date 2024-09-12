import { defineConfig } from 'tsup'
import common from '../../tsup.config.common'

export default defineConfig({
	...common,
	entry: [
		'src/index.ts',
		'src/service/index.ts',
	],
})
