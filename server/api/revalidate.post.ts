const COLLECTION_CACHE_KEYS: Record<string, string> = {
  About: 'about',
  Homepage: 'homepage',
  Portfolio_Projects: 'portfolio',
}

export default defineEventHandler(async (event) => {
  console.warn(`[ISR] ${new Date().toISOString()} - REVALIDATE: Request received`)

  // Use getAuthenticatedPb to validate auth (throws 401 if invalid)
  getAuthenticatedPb(event)

  const body = await readBody(event)
  const collections = body.collections as string[] | undefined
  console.warn(`[ISR] ${new Date().toISOString()} - REVALIDATE: Collections: ${JSON.stringify(collections)}`)

  const storage = useStorage('cache')
  const invalidated: string[] = []

  if (collections && Array.isArray(collections)) {
    for (const collection of collections) {
      const key = COLLECTION_CACHE_KEYS[collection]
      if (key) {
        const cacheKey = `pocketbase:${key}:data.json`
        await storage.removeItem(cacheKey)
        console.warn(`[ISR] ${new Date().toISOString()} - REVALIDATE: Removed cache key: ${cacheKey}`)
        invalidated.push(collection)
      }
    }
  }
  else {
    const keys = await storage.getKeys('pocketbase:')
    for (const key of keys) {
      await storage.removeItem(key)
      console.warn(`[ISR] ${new Date().toISOString()} - REVALIDATE: Removed cache key: ${key}`)
    }
    invalidated.push('all')
  }

  console.warn(`[ISR] ${new Date().toISOString()} - REVALIDATE: Complete, invalidated: ${JSON.stringify(invalidated)}`)

  return {
    revalidated: true,
    invalidated,
    timestamp: Date.now(),
  }
})
