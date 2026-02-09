export default defineEventHandler(async (event) => {
  const pb = getAuthenticatedPb(event)

  try {
    const formData = await readFormData(event)
    return await pb.collection('Portfolio_Projects').create(formData)
  }
  catch (error: unknown) {
    const err = error as { status?: number, message?: string }
    throw createError({
      statusCode: err?.status || 500,
      message: err?.message || 'Failed to create project',
    })
  }
})
