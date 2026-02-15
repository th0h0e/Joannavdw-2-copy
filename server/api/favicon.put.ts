import { join } from 'node:path'
import process from 'node:process'
import { createStorage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'

// Create storage instance inline
const assetStorage = createStorage({
  driver: fsDriver({
    base: join(process.cwd(), 'public', 'assets'),
  }),
})

/**
 * Updates the site favicon
 * Expects multipart/form-data with an 'icon' field containing the image file
 */
export default defineEventHandler(async (event) => {
  try {
    // Parse the multipart form data
    const form = await readMultipartFormData(event)
    if (!form || form.length === 0) {
      throw createError({ statusCode: 400, message: 'No file provided' })
    }
    // Find the icon file
    const iconFile = form.find(item => item.name === 'icon')
    if (!iconFile || !iconFile.data) {
      throw createError({ statusCode: 400, message: 'Icon file is required' })
    }
    // Validate it's an image
    const contentType = iconFile.type || ''
    if (!contentType.startsWith('image/')) {
      throw createError({ statusCode: 400, message: 'File must be an image' })
    }
    // Store the favicon (overwrites existing)
    await assetStorage.setItemRaw('favicon.ico', iconFile.data)
    return {
      success: true,
      message: 'Favicon updated successfully',
      url: '/assets/favicon.ico',
    }
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to update favicon: ${error}`,
    })
  }
})
