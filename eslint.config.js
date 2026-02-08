import antfu from '@antfu/eslint-config'

export default antfu({
  // TypeScript with type-aware rules for better linting
  typescript: {
    tsconfigPath: 'tsconfig.vue.json',
    overrides: {
      // Adjust any TypeScript rules here
      'ts/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },

  // Vue configuration
  vue: {
    overrides: {
      // Customize Vue rules if needed
      'vue/multi-word-component-names': 'off', // Allow single-word components like Hero.vue
      'vue/max-attributes-per-line': 'off', // Let formatter handle this
    },
    // Enable Vue accessibility linting (optional but recommended)
    // a11y: true,
  },

  // Explicitly disable React (no React code in this project)
  react: false,

  // Stylistic preferences
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },

  // Disable formatters for now (requires eslint-plugin-format)
  // Uncomment after running: npm i -D eslint-plugin-format
  // formatters: {
  //   css: true,
  //   html: true,
  // },

  // Parse .gitignore by default
  gitignore: true,

  // Additional ignores specific to your project
  ignores: [
    '**/pb_data/**',
    '**/pb_migrations/**',
    '**/.pocketbase/**',
    '**/VUE_MIGRATION_PLAN.md',
    'src/**', // Legacy React directory (empty)
    '**/*.ts', // Ignore TypeScript files for now (can enable later)
  ],

  // Disable formats you don't use
  jsonc: false,
  yaml: false,
})
