import type { H3Event } from 'h3'
import PocketBase from 'pocketbase'

// Server-side auth utility for ISR cache invalidation endpoint.
// Admin dashboard uses PocketBase SDK directly on the client (no server proxy needed).
export function getAuthenticatedPb(event: H3Event): PocketBase {
  const token = getHeader(event, 'authorization') || ''
  if (!token) {
    throw createError({ statusCode: 401,
      message: 'Authorization token is required' })
  }

  const pb = new PocketBase('https://admin.kontext.site')
  pb.authStore.save(token, null)

  return pb
}
