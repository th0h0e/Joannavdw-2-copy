export default defineEventHandler(async (event) => {
  const pb = getAuthenticatedPb(event)

  const body = await readBody<{ items: Array<{ id: string, order: number }> }>(event)
  if (!body?.items || !Array.isArray(body.items) || body.items.length === 0) {
    throw createError({ statusCode: 400, message: 'Items array is required' })
  }

  try {
    await Promise.all(
      body.items.map(item =>
        pb.collection('Portfolio_Projects').update(
          item.id,
          { Order: item.order },
          { requestKey: null },
        ),
      ),
    )
    return { success: true, count: body.items.length }
  }
  catch (error: unknown) {
    const err = error as { status?: number, message?: string }
    throw createError({
      statusCode: err?.status || 500,
      message: err?.message || 'Failed to reorder projects',
    })
  }
})
