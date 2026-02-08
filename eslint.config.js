import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  ignores: ['VUE_MIGRATION_PLAN.md', 'src/components/**'],
  rules: {
    'react/no-array-index-key': 'off',
  },
})
