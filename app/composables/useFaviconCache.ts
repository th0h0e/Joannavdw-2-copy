import type { Settings } from '~/plugins/pocketbase.client'

/**
 * Sets the site favicon from local storage.
 * Favicon is now stored locally at /assets/favicon.ico (via unstorage).
 * Cache-busting uses the settings.updated timestamp.
 */
// eslint-disable-next-line react/no-unnecessary-use-prefix
export function useFaviconCache(settingsRef: Ref<Settings | null>) {
  const faviconHref = ref<string>('/assets/favicon.ico')

  // useHead is auto-imported by Nuxt
  useHead({
    link: [
      { rel: 'icon', type: 'image/x-icon', href: faviconHref },
    ],
  })

  // Update favicon URL with cache-busting timestamp when settings change
  watch(settingsRef, (settings) => {
    if (!settings) return
    faviconHref.value = `/assets/favicon.ico?v=${settings.updated}`
  }, { immediate: true })
}
