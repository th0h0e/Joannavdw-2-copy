import PocketBase from 'pocketbase'

export const pb = new PocketBase('https://admin.kontext.site')

export function getImageUrl(record: { collectionId: string
  id: string }, filename: string): string {
  return `https://admin.kontext.site/api/files/${record.collectionId}/${record.id}/${filename}`
}
