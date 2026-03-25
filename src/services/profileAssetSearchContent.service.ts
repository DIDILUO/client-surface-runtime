import type { ContentProfileCategoryId } from '../contracts/content-api.contract'
import type {
  ProfileAssetSearchCategory,
  ProfileAssetSearchCategoryId,
  ProfileAssetSearchContent,
  ProfileAssetSearchItem,
} from '../models/profileAssetSearch.model'
import type { ProfileCategoryKey } from '../models/homeRailProfile.model'
import { createHomeRailProfileContentShell, resolveHomeRailProfileContent } from './homeRailProfileContent.service'
import { resolveContentList } from './content.service'

const CATEGORY_LABEL_MAP: Record<ProfileCategoryKey, string> = {
  collections: '资产藏品',
  blindBoxes: '盲盒',
  certificates: '资格证',
}

const searchShell: ProfileAssetSearchContent = {
  categories: [{ id: 'all', label: '全部' }],
  items: [],
  total: 0,
}

const mapCategories = (labels: Array<{ id: ProfileCategoryKey; label: string }>): ProfileAssetSearchCategory[] => {
  return [{ id: 'all', label: '全部' }, ...labels.map((item) => ({ id: item.id, label: item.label }))]
}

const mapListItem = (item: {
  resourceId: string
  title: string
  status: string
  updatedAt: string
  payload: { categoryId: ContentProfileCategoryId; subCategory: string }
}): ProfileAssetSearchItem => {
  return {
    id: item.resourceId,
    title: item.title,
    categoryId: item.payload.categoryId as ProfileCategoryKey,
    categoryLabel: CATEGORY_LABEL_MAP[item.payload.categoryId as ProfileCategoryKey],
    subCategory: item.payload.subCategory,
    acquiredAt: item.updatedAt,
    status: item.status,
  }
}

export const createProfileAssetSearchShell = (): ProfileAssetSearchContent => {
  const shell = createHomeRailProfileContentShell()

  return {
    categories: mapCategories(shell.categories),
    items: [],
    total: 0,
  }
}

export const resolveProfileAssetSearchCategories = async (): Promise<ProfileAssetSearchCategory[]> => {
  const content = await resolveHomeRailProfileContent()
  return mapCategories(content.categories)
}

export const resolveProfileAssetSearchList = async (input: {
  categoryId: ProfileAssetSearchCategoryId
  keyword: string
}): Promise<ProfileAssetSearchContent> => {
  const [categories, list] = await Promise.all([
    resolveProfileAssetSearchCategories(),
    resolveContentList({
      resourceType: 'profile_asset',
      categoryId: input.categoryId,
      keyword: input.keyword,
      page: 1,
      pageSize: 60,
    }),
  ])

  return {
    categories,
    total: list.total,
    items: list.items.map((item) =>
      mapListItem({
        resourceId: item.resourceId,
        title: item.title,
        status: item.status,
        updatedAt: item.updatedAt,
        payload: item.payload as { categoryId: ContentProfileCategoryId; subCategory: string },
      }),
    ),
  }
}
