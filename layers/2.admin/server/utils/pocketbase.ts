import type { H3Event } from 'h3'
import PocketBase from 'pocketbase'

// Server-side auth utility for admin endpoints.
// Admin dashboard uses PocketBase SDK directly on the client (no server proxy needed).
export function getAuthenticatedPb(event: H3Event): PocketBase {
  const token = getHeader(event, 'authorization')
    ?.replace('Bearer ', '') || ''
  if (!token) {
    throw createError({ statusCode: 401, message: 'Authorization token is required' })
  }

  const config = useRuntimeConfig(event)
  const pb = new PocketBase(config.pbUrl)
  pb.authStore.save(token, null)

  return pb
}
