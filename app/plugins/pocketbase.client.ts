import type {
  AboutResponse,
  HomepageResponse,
  PortfolioProjectsResponse,
  SettingsResponse,
} from '~/shared/types/pocketbase-types'
import PocketBase from 'pocketbase'

// Export types for convenience
export type About = AboutResponse
export type Homepage = HomepageResponse
export type PortfolioProject = PortfolioProjectsResponse
export type Settings = SettingsResponse

// Create PocketBase instance
const config = useRuntimeConfig()
export const pb = new PocketBase(config.public.pbUrl as string)

// Helper function to get image URL
export function getImageUrl(
  record: { id: string, collectionId: string, collectionName: string },
  filename: string,
  options?: { thumb?: string },
): string {
  return pb.files.getUrl(record, filename, options)
}

export default defineNuxtPlugin(() => {
  // Plugin is used to ensure PocketBase is initialized on the client side
  return {
    provide: {
      pb,
    },
  }
})
