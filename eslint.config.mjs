// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    typescript: true,
    vue: {
      a11y: true,
      overrides: {
        'vue/multi-word-component-names': 'off',
        'vue/max-attributes-per-line': 'off',
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
    ],

    // Disable formats you don't use
    jsonc: false,
    yaml: false,
  }),
)
