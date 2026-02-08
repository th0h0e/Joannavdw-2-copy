import type { Ref } from 'vue'
import type { Settings } from '@/plugins/pocketbase'
import { watch } from 'vue'
import { getImageUrl } from '@/plugins/pocketbase'

// eslint-disable-next-line react/no-unnecessary-use-prefix
export function useFaviconCache(settingsRef: Ref<Settings | null>) {
  const updateFavicon = (href: string) => {
    const existingLinks = document.querySelectorAll('link[rel="icon"]')
    existingLinks.forEach(link => link.remove())
    const faviconLink = document.createElement('link')
    faviconLink.rel = 'icon'
    faviconLink.type = 'image/png'
    faviconLink.href = href
    document.head.appendChild(faviconLink)
  }

  watch(settingsRef, (settings) => {
    if (!settings || !settings.favicon)
      return

    const faviconUrl = getImageUrl(settings, settings.favicon)
    const cacheKey = 'favicon_cache'
    const versionKey = 'favicon_version'
    const cachedVersion = localStorage.getItem(versionKey)
    const cachedFavicon = localStorage.getItem(cacheKey)

    if (cachedVersion === settings.updated && cachedFavicon) {
      updateFavicon(cachedFavicon)
      return
    }

    fetch(faviconUrl)
      .then(async response => response.blob())
      .then((blob) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const dataUrl = reader.result as string
          try {
            localStorage.setItem(cacheKey, dataUrl)
            localStorage.setItem(versionKey, settings.updated)
          }
          catch (e) {
            console.warn('Failed to cache favicon:', e)
          }
          updateFavicon(dataUrl)
        }
        reader.readAsDataURL(blob)
      })
      .catch((e) => {
        console.warn('Failed to load favicon:', e)
        updateFavicon(`${faviconUrl}?v=${settings.updated}`)
      })
  }, { immediate: true })
}
