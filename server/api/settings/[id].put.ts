export default defineEventHandler(async (event) => {
  const pb = getAuthenticatedPb(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Settings ID is required' })
  }

  try {
    const body = await readBody(event)
    return await pb.collection('Settings').update(id, body)
  }
  catch (error: unknown) {
    const err = error as { status?: number, message?: string }
    throw createError({
      statusCode: err?.status || 500,
      message: err?.message || 'Failed to update settings',
    })
  }
})
