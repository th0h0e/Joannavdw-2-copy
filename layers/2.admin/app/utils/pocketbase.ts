import PocketBase from 'pocketbase'

let pbInstance: PocketBase | null = null

export function usePocketBase(): PocketBase {
  if (!pbInstance) {
    const config = useRuntimeConfig()
    pbInstance = new PocketBase(config.public.pbUrl)
  }
  return pbInstance
}

export const pb = new Proxy({} as PocketBase, {
  get(_target, prop) {
    const instance = usePocketBase()
    return Reflect.get(instance, prop)
  },
})

export function getImageUrl(record: { collectionId: string, id: string }, filename: string): string {
  const config = useRuntimeConfig()
  return `${config.public.pbUrl}/api/files/${record.collectionId}/${record.id}/${filename}`
}
