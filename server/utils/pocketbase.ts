import type { H3Event } from 'h3'
import PocketBase from 'pocketbase'

/**
 * Creates an authenticated PocketBase instance from the request's Authorization header.
 * Auto-imported in all server/ routes via Nuxt's server/utils convention.
 */
export function getAuthenticatedPb(event: H3Event): PocketBase {
  const token = getHeader(event, 'authorization') || ''
  if (!token) {
    throw createError({ statusCode: 401, message: 'Authorization token is required' })
  }

  const pb = new PocketBase('https://admin.kontext.site')
  pb.authStore.save(token, null)

  return pb
}
