import antfu from '@antfu/eslint-config';

export default antfu({
	isInEditor: true,
	typescript: true,
	formatters: true,
	stylistic: {
		indent: 'tab',
		semi: true,
	},
	ignores: ['./src/db/schema/*.ts'],
}, {
	files: ['**/*.ts'],

	rules: {
		'perfectionist/sort-objects': ['error', {
			groups: [
				'top',
				'unknown',
				'bottom',
			],
			customGroups: {
				top: ['id', 'name'],
				bottom: '*_metadata',
			},
		}],
		'ts/consistent-type-definitions': ['error', 'type'],
		'antfu/top-level-function': 'off',
		'antfu/no-top-level-await': 'off',
	},
});
