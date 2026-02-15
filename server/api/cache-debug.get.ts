// Debug endpoint to inspect current cache state
// Returns all cache keys matching 'pocketbase:' prefix and their sizes
// Useful for verifying ISR is working and cache entries exist
// Requires authentication via Bearer token
export default defineEventHandler(async (event) => {
  // Use getAuthenticatedPb to validate auth (throws 401 if invalid)
  getAuthenticatedPb(event)

  const storage = useStorage('cache')
  const keys = await storage.getKeys('pocketbase:')

  const cacheState: Record<string, { exists: boolean
    size?: number }> = {}

  for (const key of keys) {
    const item = await storage.getItem(key)
    cacheState[key] = {
      exists: !!item,
      size: item ? JSON.stringify(item).length : 0,
    }
  }

  console.warn(`[ISR] ${new Date().toISOString()} - DEBUG: Cache state requested`)

  return {
    timestamp: new Date().toISOString(),
    cacheKeys: keys,
    cacheState,
    totalKeys: keys.length,
  }
})
