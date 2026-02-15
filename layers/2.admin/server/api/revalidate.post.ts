// Publish endpoint - called from dashboard "Publish Changes" button
// With CSR (ssr: false), no server cache exists to invalidate
// This endpoint remains for API consistency and auth verification
export default defineEventHandler(async (event) => {
  // Use getAuthenticatedPb to validate auth (throws 401 if invalid)
  getAuthenticatedPb(event)

  console.warn(`[PUBLISH] ${new Date()
    .toISOString()} - Changes published (CSR mode - no cache to invalidate)`)

  return {
    published: true,
    message: 'Changes are live (client-side rendering)',
    timestamp: Date.now(),
  }
})
