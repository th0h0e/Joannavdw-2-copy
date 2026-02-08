/**
 * Fetches a binary resource from the PocketBase server and returns it as a Blob.
 *
 * Validates that the URL points to the configured PocketBase instance
 * to prevent the server from being used as an open proxy (SSRF protection).
 *
 * Auto-imported by Nitro in all server routes and other server utils.
 */
export async function fetchBinary(url: string): Promise<Blob> {
  const config = useRuntimeConfig()
  const pbUrl = config.public.pbUrl as string

  if (!url.startsWith(pbUrl)) {
    throw createError({ statusCode: 400, statusMessage: 'URL must point to the PocketBase server' })
  }

  const response = await globalThis.fetch(url)
  if (!response.ok) {
    throw createError({ statusCode: response.status, statusMessage: 'Failed to fetch resource' })
  }

  return response.blob()
}
