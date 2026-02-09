export default defineEventHandler(async (event) => {
  const pb = getAuthenticatedPb(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Homepage ID is required' })
  }

  try {
    const contentType = getHeader(event, 'content-type') || ''
    const body = contentType.includes('multipart/form-data')
      ? await readFormData(event)
      : await readBody(event)

    return await pb.collection('Homepage').update(id, body)
  }
  catch (error: unknown) {
    const err = error as { status?: number, message?: string }
    throw createError({
      statusCode: err?.status || 500,
      message: err?.message || 'Failed to update homepage',
    })
  }
})
