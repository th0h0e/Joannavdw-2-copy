import PocketBase from 'pocketbase'

export const pb = new PocketBase('https://admin.kontext.site')

export interface Homepage {
  id: string
  collectionId: string
  collectionName: string
  Hero_Title: string
  Hero_Image: string
  Hero_Image_Mobile: string
  Is_Active: boolean
  [key: string]: unknown
}

export interface PortfolioProject {
  id: string
  collectionId: string
  collectionName: string
  Title: string
  Description: string
  Images: string[]
  Order: number
  Responsibility: string[]
  Responsibility_json: string[]
  [key: string]: unknown
}

export function getImageUrl(record: { collectionId: string, id: string }, filename: string): string {
  return `https://admin.kontext.site/api/files/${record.collectionId}/${record.id}/${filename}`
}
