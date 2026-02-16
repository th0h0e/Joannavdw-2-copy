# Joanna vdw Portfolio

A Nuxt 4 portfolio website with client-side rendering, PocketBase CMS, and Nuxt UI components.

## Tech Stack

- **Framework**: Nuxt 4 with TypeScript (strict mode)
- **UI**: Nuxt UI v4 + Tailwind CSS v4
- **Backend**: PocketBase CMS
- **Animations**: @vueuse/motion
- **Utilities**: VueUse
- **Linting**: Antfu ESLint config

## Project Structure

```
├── app/                    # Main application
│   ├── components/         # Vue components
│   ├── composables/        # Auto-imported composables
│   ├── pages/              # File-based routing
│   ├── layouts/            # Layout templates
│   └── utils/              # Utility functions
├── layers/
│   └── 2.admin/            # Admin panel layer
│       ├── app/            # Admin Vue app
│       └── server/         # Admin API routes
├── assets/                 # Static assets
└── docs/                   # Documentation
```

## Code Standards

### TypeScript & Vue

- Use TypeScript strict mode - all code must be fully typed
- Use `<script setup lang="ts">` for all Vue components
- Define props with `defineProps<T>()` syntax
- Use Vue 3 Composition API patterns

### Styling

- Use Tailwind CSS utility classes
- Custom styles go in `<style scoped>` blocks only when necessary
- Follow existing naming patterns (e.g., `title-font` custom class)

### Component Patterns

- Keep components small and focused
- Use composables for reusable logic (see `app/composables/`)
- Follow existing component structure and naming

### ESLint Rules

The project uses Antfu ESLint config with:
- Single quotes
- No semicolons
- 2-space indentation
- Vue a11y rules enabled

Run `bun lint:fix` to auto-fix linting issues.

## Architecture Notes

### Layers

This project uses Nuxt layers for separation:
- **Main app**: Portfolio frontend (`app/`)
- **Admin layer**: Dashboard/CMS (`layers/2.admin/`)

### PocketBase

- Client-side PocketBase instance in `app/utils/pocketbase.ts`
- Server-side utilities in `layers/2.admin/server/utils/pocketbase.ts`
- Types generated via `pocketbase-typegen`

### Rendering

- Client-side only rendering (`ssr: false`)
- No server-side rendering or hydration concerns

## Commands

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun lint` - Check linting
- `bun lint:fix` - Fix linting issues
- `bun generate` - Generate static site

## Tool Permissions

OpenCode uses a permission system with three actions: `allow`, `ask`, `deny`.

### Agents

OpenCode has two main modes of operation:

**Build Agent** (default for development work)
- Runs autonomously without asking for approval
- Follows the permission schema defined below
- Use Tab key to switch to this agent

**Plan Agent** (for analysis and planning)
- Asks for approval before making changes
- Restricted to read-only operations by default
- Use for code review and planning without modifications

### Permission Schema

The permission schema defines what actions are allowed, require approval, or are blocked:

**Bash Commands**

Allowed (run automatically):
- `git *` - all git commands
- `npm run *`, `pnpm run *`, `bun run *` - package scripts
- `node *`, `python *` - runtime execution
- `eslint *`, `prettier *` - linting and formatting
- `test *` - test commands
- `ls *`, `cat *`, `find *`, `grep *`, `which *` - file inspection
- `mkdir *`, `touch *`, `cp *`, `mv *`, `rm *` - file management
- `head *`, `tail *`, `wc *`, `pwd`, `cd *` - utilities
- `* --version`, `* --help *` - version and help queries

Ask for approval:
- Any bash command not explicitly allowed or denied

Denied (blocked):

Package installation (prevents accidental dependency changes):
- `npm install *`, `npm i *`
- `pnpm install *`, `pnpm add *`, `pnpm i *`
- `bun install *`, `bun add *`
- `yarn *`
- `deno install *`, `deno add *`

System commands (safety protection):
- `sudo *`
- `chmod *`, `chown *`
- `rm /* *`, `rm /Users *`, `rm /etc *`, `rm /var *`
- `rm /tmp *`, `rm /bin *`, `rm /usr *`
- `rm /Library *`, `rm /System *`

### Guidelines

1. **Ask before installing packages** - Package installation is blocked for safety
2. **Stay in project directory** - External directory access requires approval
3. **Use existing scripts** - Prefer `bun run *` over direct package manager commands
4. **Check before destructive operations** - File deletions are allowed but should be used carefully
