import type { Settings } from '~/plugins/pocketbase.client'
import { getImageUrl } from '~/plugins/pocketbase.client'

// eslint-disable-next-line react/no-unnecessary-use-prefix
export function useFaviconCache(settingsRef: Ref<Settings | null>) {
  const faviconHref = ref<string>('')

  // useHead is auto-imported by Nuxt
  useHead({
    link: [
      { rel: 'icon', type: 'image/png', href: faviconHref },
    ],
  })

  watch(settingsRef, (settings) => {
    if (!settings || !settings.favicon) return

    const faviconUrl = getImageUrl(settings, settings.favicon)
    const cacheKey = 'favicon_cache'
    const versionKey = 'favicon_version'
    const cachedVersion = localStorage.getItem(versionKey)
    const cachedFavicon = localStorage.getItem(cacheKey)

    if (cachedVersion === settings.updated && cachedFavicon) {
      faviconHref.value = cachedFavicon
      return
    }

    fetch(faviconUrl)
      .then(r => r.blob())
      .then((blob) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const dataUrl = reader.result as string
          try {
            localStorage.setItem(cacheKey, dataUrl)
            localStorage.setItem(versionKey, settings.updated)
          } catch (e) {
            console.warn('Failed to cache favicon:', e)
          }
          faviconHref.value = dataUrl
        }
        reader.readAsDataURL(blob)
      })
      .catch(() => {
        faviconHref.value = `${faviconUrl}?v=${settings.updated}`
      })
  }, { immediate: true })
}
