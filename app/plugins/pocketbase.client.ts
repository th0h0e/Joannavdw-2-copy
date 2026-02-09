import type {
  AboutResponse,
  BaseSystemFields,
  HomepageResponse,
  PortfolioProjectsResponse,
  SettingsResponse,
} from '../shared/types/pocketbase-types'
import PocketBase from 'pocketbase'

// Initialized inside defineNuxtPlugin where useRuntimeConfig() is available.
// The named export below gives all importers a live binding that resolves
// after the plugin runs (before any component setup or composable executes).
let pb!: PocketBase

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  pb = new PocketBase(config.public.pbUrl as string)

  return {
    provide: {
      pb,
    },
  }
})

// Continue to export pb as named export for direct imports
export { pb }

// Re-export types with simpler names for use throughout the app
// Use the Response types with proper generics for JSON fields
export type PortfolioProject = PortfolioProjectsResponse<string[]> & {
  Responsibility?: string[] // Legacy field alias
}
export type Homepage = HomepageResponse
export type About = AboutResponse<string[]> & {
  Client_List?: string[] // Legacy field alias
}
export type Settings = SettingsResponse

// Helper function to get image URLs
export function getImageUrl(record: BaseSystemFields, filename: string) {
  return pb.files.getURL(record, filename)
}

// Helper function to generate dynamic project title styles
export function getProjectTitleStyle(settings: Settings | null) {
  const mobileFontSize = settings?.Mobile_Font_Size ?? 1.25

  return {
    fontFamily: 'EnduroWeb, sans-serif',
    letterSpacing: '0.03em',
    fontSize: `${mobileFontSize}rem`,
  }
}

// Helper to get responsive font size classes (for CSS-in-JS)
export function getResponsiveFontSizes(settings: Settings | null) {
  return {
    mobile: settings?.Mobile_Font_Size ?? 1.25,
    tablet: settings?.Tablet_Font_Size ?? 1.875,
    desktop: settings?.Desktop_Font_Size ?? 2.25,
    largeDesktop: settings?.Large_Desktop_Font_Size ?? 3,
  }
}
