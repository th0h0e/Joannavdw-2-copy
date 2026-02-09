export default defineEventHandler(async (event) => {
  const pb = getAuthenticatedPb(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Project ID is required' })
  }

  try {
    await pb.collection('Portfolio_Projects').delete(id)
    return { success: true }
  }
  catch (error: unknown) {
    const err = error as { status?: number, message?: string }
    throw createError({
      statusCode: err?.status || 500,
      message: err?.message || 'Failed to delete project',
    })
  }
})
