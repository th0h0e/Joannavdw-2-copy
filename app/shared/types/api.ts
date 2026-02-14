export interface PaginatedResponse<T> {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
  items: T[]
}

export function findActiveItem<T extends { Is_Active?: boolean }>(items: T[] | undefined): T | null {
  return items?.find(i => i.Is_Active) ?? null
}
