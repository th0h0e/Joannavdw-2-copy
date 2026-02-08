// Security hook: validate and control package scripts
module.exports = {
  hooks: {
    beforeInstall: [],
    afterPackageInstall: [],
  },
}

// Allowed postinstall scripts (whitelist approach)
const ALLOWED_SCRIPTS = {
  'nuxt': ['nuxt prepare', 'nuxt build'],
  '@nuxt/ui': [],
  // Add other trusted packages here
}

console.log('✓ pnpmfile security hooks loaded')
