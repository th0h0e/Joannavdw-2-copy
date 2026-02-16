# Joanna vdw Portfolio

A Nuxt 4 portfolio website with client-side rendering, PocketBase CMS, and Nuxt UI components.

## Tech Stack

- **Framework**: Nuxt 4 with TypeScript (strict mode)
- **UI**: Nuxt UI v4 + Tailwind CSS v4
- **Backend**: PocketBase CMS
- **Animations**: @vueuse/motion
- **Utilities**: VueUse
- **Linting**: Antfu ESLint config

## Commands

```bash
bun dev              # Start development server
bun build            # Build for production
bun generate         # Generate static site
bun preview          # Preview production build
bun lint             # Check linting
bun lint:fix         # Auto-fix linting issues
bun prepare          # Prepare Nuxt (generate types)
```

Note: This project has no test suite configured.

## Project Structure

```
├── app/                    # Main application
│   ├── components/         # Vue components (auto-imported)
│   ├── composables/        # Auto-imported composables
│   ├── pages/              # File-based routing
│   ├── layouts/            # Layout templates
│   └── utils/              # Utility functions (auto-imported)
├── layers/
│   └── 2.admin/            # Admin panel layer
│       ├── app/            # Admin Vue app
│       │   ├── components/
│       │   ├── pages/
│       │   ├── layouts/
│       │   └── utils/
│       └── server/         # Admin API routes
├── assets/                 # Static assets (CSS, fonts)
└── public/                 # Public static files
```

## TypeScript & Vue Conventions

### Script Setup

Always use `<script setup lang="ts">` for Vue components:

```vue
<script setup lang="ts">
const props = defineProps<{
  title: string
  count?: number
}>()

const emit = defineEmits<{
  save: []
  cancel: []
  update: [value: string]
}>()
</script>
```

### Type Definitions

- Define interfaces at the top of the file before functions
- Use TypeScript strict mode - all code must be fully typed
- Prefer type inference where possible, explicit types where needed

```typescript
interface ImageItem {
  id: string
  file?: File
  url: string
  filename: string
  isExisting: boolean
}

const images = ref<ImageItem[]>([])
```

### Imports

- Vue composables (ref, computed, onMounted, etc.) are auto-imported
- VueUse functions are auto-imported via @vueuse/nuxt
- Use explicit imports for:
  - External libraries: `import { useDropZone } from '@vueuse/core'`
  - Layer types: `import type { PortfolioProjectsResponse } from '#layers/2.admin/app/shared/types/pocketbase-types'`
  - Layer utilities: `import { getImageUrl, pb } from '#layers/2.admin/app/utils/pocketbase'`

### Props and Emits

Use TypeScript generic syntax:

```typescript
const props = defineProps<{
  project: PortfolioProjectsResponse<string[]> | null
  isVisible: boolean
}>()

const emit = defineEmits<{
  save: []
  cancel: []
  showToast: [message: string, type: 'success' | 'error']
}>()
```

## Code Style

### ESLint Rules (Antfu Config)

- Single quotes for strings
- No semicolons
- 2-space indentation
- Trailing commas in multiline structures
- Vue a11y rules enabled

### Formatting

Run `bun lint:fix` before committing to auto-fix style issues.

### Function Definitions

Export functions from composables with `export function`:

```typescript
export function useHomepageData() {
  const config = useRuntimeConfig()
  
  const { data: response } = useFetch<HomepageResponse>(
    `${config.public.pbUrl}/api/collections/Homepage/records`,
    { key: 'homepage' },
  )
  
  return { heroImage, heroTitle }
}
```

### Naming Conventions

- **Components**: PascalCase (e.g., `HeroSection.vue`, `ProjectEditor.vue`)
- **Composables**: camelCase with `use` prefix (e.g., `useHomepageData.ts`)
- **Utils**: camelCase functions (e.g., `getImageUrl`)
- **Props**: camelCase in templates, kebab-case in HTML attributes
- **CSS classes**: kebab-case with Tailwind utilities

## Styling

### Tailwind CSS

- Use Tailwind utility classes as primary styling method
- Custom styles only in `<style scoped>` blocks when necessary

```vue
<style scoped>
.duration-1200 {
  transition-duration: 1200ms;
}

.scale-30 {
  transform: scale(0.3);
}
</style>
```

### Custom Classes

Use existing custom classes like `title-font` for brand typography.

## Error Handling

### Async Operations

Use try/catch with proper error typing:

```typescript
async function handleSubmit() {
  loading.value = true
  
  try {
    await pb.collection('Portfolio_Projects').update(props.project.id, formData)
    emit('save')
  }
  catch (err: unknown) {
    console.error('Error saving project:', err)
    const error = err as { status?: number, data?: { message?: string }, message?: string }
    
    if (error?.status === 401 || error?.status === 403) {
      emit('showToast', 'Session expired. Please login again.', 'error')
      pb.authStore.clear()
      navigateTo('/admin')
      return
    }
    
    emit('showToast', `Failed: ${error?.data?.message || error?.message || 'Unknown error'}`, 'error')
  }
  finally {
    loading.value = false
  }
}
```

## Architecture Notes

### Nuxt Layers

This project uses Nuxt layers for separation:
- **Main app**: Portfolio frontend (`app/`)
- **Admin layer**: Dashboard/CMS (`layers/2.admin/`)

Access layer imports with `#layers/2.admin/...` path.

### PocketBase

- Client: `app/utils/pocketbase.ts` - singleton pattern
- Admin: `layers/2.admin/app/utils/pocketbase.ts`
- Types generated via `pocketbase-typegen`
- Image URLs: Use `getImageUrl(record, filename)` helper

### Rendering

- Client-side only (`ssr: false` in nuxt.config.ts)
- No server-side rendering or hydration concerns
- Use `onMounted` for DOM-dependent operations

### Auto-imports

Nuxt auto-imports:
- Vue composables (ref, computed, watch, etc.)
- Nuxt composables (useRoute, useRouter, useFetch, etc.)
- VueUse functions (@vueuse/core)
- Components from `app/components/`
- Composables from `app/composables/`
- Utils from `app/utils/`

## Component Patterns

### Keep Components Focused

Each component should have a single responsibility:
- `HeroSection.vue` - Hero image and title
- `MotionCarousel.vue` - Image carousel logic
- `ProjectPopup.vue` - Project details modal

### Use Composables for Reusable Logic

Extract shared logic into composables:

```typescript
// app/composables/useCarouselReset.ts
export function useCarouselReset(projectCount: Ref<number>) {
  const resetInactiveCarousels = () => { /* ... */ }
  return { resetInactiveCarousels }
}
```

### Lazy Loading

Prefix components with `Lazy` for lazy loading:

```vue
<LazyProjectPopup v-if="showPopup" />
<LazyHamburgerMenu :is-popup-visible="showPopup" />
```

## Accessibility

- Vue a11y rules are enabled in ESLint
- Include `aria-label` on interactive elements
- Use semantic HTML elements
- Ensure keyboard navigation works
