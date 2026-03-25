export type ProfileCategoryKey = 'collections' | 'blindBoxes' | 'certificates'

export interface ProfileCategory {
  id: ProfileCategoryKey
  label: string
}

export interface ProfileAssetItem {
  id: string
  name: string
  date: string
  subCategory: string
}

export interface ProfileSummary {
  displayName: string
  totalValue: string
  holdings: string
  address: string
}

export interface HomeRailProfileContent {
  summary: ProfileSummary
  categories: ProfileCategory[]
  subCategories: string[]
  assets: Record<ProfileCategoryKey, ProfileAssetItem[]>
}
