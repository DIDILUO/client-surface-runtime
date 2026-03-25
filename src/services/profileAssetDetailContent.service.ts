import type { ContentProfileAssetPayloadDto } from '../contracts/content-api.contract'
import type { ProfileAssetDetailContent } from '../models/profileAssetDetail.model'
import type { ProfileCategoryKey } from '../models/homeRailProfile.model'
import { createContentResourceSnapshot } from '../implementations/content.mock'
import { resolveContentResource } from './content.service'

const PROFILE_CATEGORY_META: Record<ProfileCategoryKey, { label: string; englishLabel: string }> = {
  collections: { label: '资产藏品', englishLabel: 'COLLECTION' },
  blindBoxes: { label: '盲盒', englishLabel: 'BLIND BOX' },
  certificates: { label: '资格证', englishLabel: 'CREDENTIAL' },
}

const createFallbackPayload = (categoryId: ProfileCategoryKey): ContentProfileAssetPayloadDto => ({
  categoryId,
  subCategory: '',
  acquiredAt: '',
})

const adaptProfileAssetDetail = (
  resource: {
    resourceId: string
    title: string
    status: string
    summary?: string
    payload: ContentProfileAssetPayloadDto
  },
  fallbackCategoryId: ProfileCategoryKey,
): ProfileAssetDetailContent => {
  const categoryId = (resource.payload.categoryId || fallbackCategoryId) as ProfileCategoryKey
  const categoryMeta = PROFILE_CATEGORY_META[categoryId]

  return {
    id: resource.resourceId,
    title: resource.title,
    categoryId,
    categoryLabel: categoryMeta.label,
    categoryEnglishLabel: categoryMeta.englishLabel,
    subCategory: resource.payload.subCategory,
    acquiredAt: resource.payload.acquiredAt,
    statusLabel: resource.status,
    summary: resource.summary ?? '当前资产已归档到个人中心资产链路，后续可在这里承接更多权益与管理动作。',
  }
}

export const createProfileAssetDetailShell = (
  assetId: string,
  fallbackCategoryId: ProfileCategoryKey = 'collections',
): ProfileAssetDetailContent => {
  const snapshot = createContentResourceSnapshot('profile_asset', assetId)
  const payload = (snapshot?.payload as ContentProfileAssetPayloadDto | undefined) ?? createFallbackPayload(fallbackCategoryId)

  return adaptProfileAssetDetail(
    {
      resourceId: snapshot?.resourceId ?? assetId,
      title: snapshot?.title ?? assetId,
      status: snapshot?.status ?? 'OWNED',
      summary: snapshot?.summary,
      payload,
    },
    fallbackCategoryId,
  )
}

export const resolveProfileAssetDetailContent = async (
  assetId: string,
  fallbackCategoryId: ProfileCategoryKey = 'collections',
): Promise<ProfileAssetDetailContent> => {
  const resource = await resolveContentResource({
    resourceType: 'profile_asset',
    resourceId: assetId,
  })

  return adaptProfileAssetDetail(
    {
      resourceId: resource.resourceId,
      title: resource.title,
      status: resource.status,
      summary: resource.summary,
      payload: resource.payload as ContentProfileAssetPayloadDto,
    },
    fallbackCategoryId,
  )
}
