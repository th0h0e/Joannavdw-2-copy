/**
 * GET /api/proxy-image?url=<pocketbase-asset-url>
 *
 * Proxies a binary image from PocketBase through the Nitro server.
 * Returns the Blob directly — h3 automatically sets Content-Type
 * and Content-Length headers from the Blob metadata.
 */
export default defineEventHandler(async (event) => {
  const { url } = getQuery(event)

  if (!url || typeof url !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Missing url query parameter' })
  }

  return fetchBinary(url)
})
