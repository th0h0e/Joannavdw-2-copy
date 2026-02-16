// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(antfu({
  react: false,
  typescript: true,
  vue: {
    a11y: true,
    overrides: {
      'vue/multi-word-component-names': 'off',
      'vue/max-attributes-per-line': ['error', { singleline: 1, multiline: 1 }],
    },
  },

  // Formatters for CSS, HTML, etc.
  formatters: {
    css: true,
    html: true,
  },

  // Stylistic preferences
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },

  // Parse .gitignore by default
  gitignore: true,

  // Additional ignores
  ignores: [
    '**/pb_data/**',
    '**/pb_migrations/**',
    '**/.pocketbase/**',
    '**/VUE_MIGRATION_PLAN.md',
    'src/**',
    '**/.nuxt/**',
    'docs/**',
    'app/plugins/*.client.ts',
  ],

  // Disable formats you don't use
  jsonc: false,
  yaml: false,
  markdown: false,
}))
  .override('antfu/stylistic/rules', {
    rules: {
      'style/function-paren-newline': ['error', 'multiline'],
      'style/newline-per-chained-call': ['error', { ignoreChainWithDepth: 1 }],
      'antfu/consistent-list-newline': 'error',
    },
  })
