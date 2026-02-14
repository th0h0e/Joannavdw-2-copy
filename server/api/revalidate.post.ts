const COLLECTION_CACHE_KEYS: Record<string, string> = {
  About: 'about',
  Homepage: 'homepage',
  Portfolio_Projects: 'portfolio',
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  const collections = body.collections as string[] | undefined
  const storage = useStorage('cache')
  const invalidated: string[] = []

  if (collections && Array.isArray(collections)) {
    for (const collection of collections) {
      const key = COLLECTION_CACHE_KEYS[collection]
      if (key) {
        const cacheKey = `pocketbase:${key}:data.json`
        await storage.removeItem(cacheKey)
        invalidated.push(collection)
      }
    }
  }
  else {
    const keys = await storage.getKeys('pocketbase:')
    for (const key of keys) {
      await storage.removeItem(key)
    }
    invalidated.push('all')
  }

  return {
    revalidated: true,
    invalidated,
    timestamp: Date.now(),
  }
})
