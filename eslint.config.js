import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    quotes: 'single',
  },
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'node/prefer-global/process': 'off',
  },
})
