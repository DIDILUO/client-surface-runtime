import type { ProfileCategoryKey } from './homeRailProfile.model'

export type ProfileAssetSearchCategoryId = 'all' | ProfileCategoryKey

export interface ProfileAssetSearchCategory {
  id: ProfileAssetSearchCategoryId
  label: string
}

export interface ProfileAssetSearchItem {
  id: string
  title: string
  categoryId: ProfileCategoryKey
  categoryLabel: string
  subCategory: string
  acquiredAt: string
  status: string
}

export interface ProfileAssetSearchContent {
  categories: ProfileAssetSearchCategory[]
  items: ProfileAssetSearchItem[]
  total: number
}
