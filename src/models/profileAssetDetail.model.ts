import type { ProfileCategoryKey } from './homeRailProfile.model'

export interface ProfileAssetDetailContent {
  id: string
  title: string
  categoryId: ProfileCategoryKey
  categoryLabel: string
  categoryEnglishLabel: string
  subCategory: string
  acquiredAt: string
  statusLabel: string
  summary: string
}
