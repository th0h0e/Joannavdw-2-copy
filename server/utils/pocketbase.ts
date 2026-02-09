import type { H3Event } from 'h3'
import PocketBase from 'pocketbase'

/**
 * Creates an authenticated PocketBase instance from the request's Authorization header.
 * Throws 401 if no token is present. PocketBase itself validates the token on each API call.
 */
export function getAuthenticatedPb(event: H3Event): PocketBase {
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) {
    throw createError({ statusCode: 401, message: 'Authentication required' })
  }

  const config = useRuntimeConfig()
  const pb = new PocketBase(config.pbUrl as string)
  pb.authStore.save(token, null)

  return pb
}
