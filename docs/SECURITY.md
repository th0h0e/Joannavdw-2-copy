# Security Configuration

This project uses multiple layers of security to prevent malicious package installation and execution.

## Security Settings

### 1. Postinstall Script Blocking
- **Location:** `.pnpmrc`
- **Setting:** `ignore-scripts=true`
- **Purpose:** Prevents unauthorized postinstall scripts from executing automatically
- **Impact:** All packages must be manually approved before their scripts run

### 2. Package Integrity Verification
- **Location:** `.pnpmrc`
- **Setting:** `verify-store-integrity=true`
- **Purpose:** Ensures downloaded packages haven't been tampered with
- **Impact:** Detects corrupted or modified packages

### 3. Dependency Version Pinning
- **Location:** `package.json` (overrides)
- **Setting:** `chokidar@5.0.0` pinned
- **Purpose:** Prevents installation of known problematic versions
- **Impact:** Blocks supply chain incidents targeting specific versions

### 4. Strict Peer Dependencies
- **Location:** `.pnpmrc`
- **Setting:** `strict-peer-dependencies=false` (relaxed for compatibility)
- **Purpose:** Catches dependency conflicts early
- **Impact:** Prevents version mismatches

## Installation Instructions

**SAFE INSTALLATION (Recommended)**
```bash
pnpm install
# This runs WITHOUT executing postinstall scripts due to ignore-scripts=true
```

**SETUP WITH SCRIPTS**
```bash
pnpm setup
# This installs packages AND explicitly runs nuxt prepare
# Only do this if you trust all dependencies
```

**MANUAL POSTINSTALL**
```bash
pnpm install
nuxt prepare
# Separate steps for maximum control
```

## Monitoring Package Changes

Before reinstalling:
```bash
git status          # Check for unexpected files
pnpm install --dry-run  # Preview what will be installed
```

After installing:
```bash
git status          # Verify only expected files changed
pnpm list           # Review all installed packages
```

## Adding New Dependencies

When adding a new package:
1. Review the package on npm.js and GitHub
2. Check for recent security audits
3. Install with `pnpm add <package>`
4. Verify postinstall script whitelist in `.pnpmfile.cjs`
5. Test the application

## Security Audits

Run regular audits:
```bash
pnpm audit --fix
```

## Blocked Actions

The following are blocked by default:
- ✗ Postinstall scripts (unless explicitly allowed)
- ✗ Preinstall scripts
- ✗ Prepare scripts
- ✗ Changes to lockfile (frozen-lockfile=false allows updates, but verify before committing)

## Trusted Packages Whitelist

Currently allowed to run scripts:
- `nuxt` - Required for development framework

To whitelist new packages, add to `.pnpmfile.cjs` ALLOWED_SCRIPTS object.
