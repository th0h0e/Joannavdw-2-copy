import PocketBase from 'pocketbase'

let pbInstance: PocketBase | null = null

export function usePocketBase(): PocketBase {
  if (!pbInstance) {
    const config = useRuntimeConfig()
    pbInstance = new PocketBase(config.public.pbUrl)
  }
  return pbInstance
}

// Legacy export for backward compatibility
export const pb = new PocketBase('https://admin.kontext.site')

// Image URL helper
export function getImageUrl(record: { collectionId: string, id: string }, filename: string): string {
  const config = useRuntimeConfig()
  return `${config.public.pbUrl}/api/files/${record.collectionId}/${record.id}/${filename}`
}
