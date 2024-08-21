import antfu from '@antfu/eslint-config'

export default antfu({
	markdown: false,
	jsonc: {
		stylistic: {
			indent: 2,
		},
	},
	ignores: [
		'.githooks/**',
	],
	stylistic: {
		indent: 'tab',
	},
	rules: {
		'ts/no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
			},
		],
	},
}).renamePlugins({
	ts: '@typescript-eslint',
	yaml: 'yml',
	node: 'n',
})
