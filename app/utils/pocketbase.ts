export function getImageUrl(record: { collectionId: string, id: string }, filename: string): string {
  const config = useRuntimeConfig()
  return `${config.public.pbUrl}/api/files/${record.collectionId}/${record.id}/${filename}`
}
