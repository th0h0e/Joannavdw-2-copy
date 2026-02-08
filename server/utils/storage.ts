import { createStorage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'
import { join } from 'node:path'

/**
 * Storage for site assets (favicon, logos, etc.)
 * Stored in public/ directory so they're directly accessible via HTTP
 */
export const assetStorage = createStorage({
  driver: fsDriver({
    base: join(process.cwd(), 'public', 'assets')
  })
})

/**
 * Alternative: Storage for admin-uploaded content (if you want to keep it separate from public)
 */
export const uploadsStorage = createStorage({
  driver: fsDriver({
    base: join(process.cwd(), '.data', 'uploads')
  })
})
