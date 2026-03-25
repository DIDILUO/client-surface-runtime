export type ContentSceneId = 'home' | 'activity' | 'profile' | 'settings' | 'service_hub'
export type ContentResourceType =
  | 'notice'
  | 'home_banner'
  | 'activity'
  | 'drop'
  | 'market_action'
  | 'market_item'
  | 'category'
  | 'asset'
  | 'user_profile'
  | 'service_entry'
  | 'service_action'
  | 'settings_action'
  | 'profile_asset'
export type ContentActionTargetType = never
export type ContentTargetType = ContentResourceType | ContentActionTargetType
export type ContentMarketActionId = 'search' | 'history'
export type ContentHomeBannerTone = 'dawn' | 'azure' | 'ember'
export type ContentPlaceholderIconKey = 'box' | 'cpu' | 'aperture' | 'hexagon' | 'triangle' | 'disc3'
export type ContentMarketBadgeType = 'new' | 'hot' | 'featured'
export type ContentMarketVisualTone = 'ink' | 'mist' | 'aqua' | 'sand'
export type ContentActivityEntryTone = 'dark' | 'light' | 'soft'
export type ContentProfileCategoryId = 'collections' | 'blindBoxes' | 'certificates'
export type ContentServiceEntryId = 'orders' | 'auth' | 'wallet' | 'invite' | 'community'
export type ContentServiceEntryTone = 'cyan' | 'green' | 'amber' | 'rose' | 'slate'
export type ContentServiceHubIndicatorTone = 'cyan' | 'green' | 'amber' | 'rose' | 'red'

export interface ContentEnvelope<T> {
  code: number
  message: string
  requestId: string
  serverTime: string
  data: T
}

export interface ContentTargetDto {
  targetType: ContentTargetType
  targetId: string
}

export interface ContentFocalPointDto {
  x: number
  y: number
}

export interface ContentAssetVariantsDto {
  thumb?: string
  card?: string
  banner?: string
  detail?: string
}

export interface ContentAssetDto {
  assetId: string
  originalUrl: string
  width: number
  height: number
  focalPoint?: ContentFocalPointDto
  variants?: ContentAssetVariantsDto
}

export interface ContentNoticeSummaryDto {
  noticeId: string
  title: string
  type: string
  time: string
  isUnread: boolean
  target: ContentTargetDto
}

export interface ContentNoticeParagraphBlockDto {
  id: string
  kind: 'paragraph'
  text: string
}

export interface ContentNoticeListBlockDto {
  id: string
  kind: 'list'
  title: string
  items: string[]
}

export type ContentNoticeBlockDto = ContentNoticeParagraphBlockDto | ContentNoticeListBlockDto

export interface ContentNoticePayloadDto {
  time: string
  isUnread: boolean
  englishTitle: string
  badges: string[]
  blocks: ContentNoticeBlockDto[]
}

export interface ContentDropPayloadDto {
  sectionTitle: string
  sectionSubtitle: string
  priceLabel: string
  currency: string
  priceInCent: number
  mintedCount: number
  supplyCount: number
  placeholderIconKey?: ContentPlaceholderIconKey
}

export interface ContentHomeBannerPayloadDto {
  liveLabel: string
  tone: ContentHomeBannerTone
}

export interface ContentActivityPayloadDto {
  eyebrow: string
  description: string
  tone: ContentActivityEntryTone
  badgeLabel?: string
}

export interface ContentMarketItemPayloadDto {
  currency: string
  priceInCent: number
  categoryIds: string[]
  placeholderIconKey?: ContentPlaceholderIconKey
  visualTone: ContentMarketVisualTone
  badgeType?: ContentMarketBadgeType
  badgeLabel?: string
}

export interface ContentAssetPayloadDto {
  width: number
  height: number
}

export interface ContentProfileAssetPayloadDto {
  categoryId: ContentProfileCategoryId
  subCategory: string
  acquiredAt: string
}

export interface ContentServiceEntryMetricDto {
  metricId: string
  label: string
  value: string
  caption?: string
}

export interface ContentServiceEntryItemDto {
  itemId: string
  title: string
  description: string
  value?: string
  target?: ContentTargetDto
}

export interface ContentServiceEntrySectionDto {
  sectionId: string
  title: string
  englishTitle: string
  items: ContentServiceEntryItemDto[]
}

export interface ContentServiceEntryPayloadDto {
  serviceId: ContentServiceEntryId
  englishTitle: string
  tone: ContentServiceEntryTone
  statusLabel: string
  badges: string[]
  metrics: ContentServiceEntryMetricDto[]
  sections: ContentServiceEntrySectionDto[]
}

export interface ContentActionEntryPayloadDto {
  actionId: string
  parentId: string
  englishTitle: string
  tone: ContentServiceEntryTone
  statusLabel: string
  badges: string[]
  metrics: ContentServiceEntryMetricDto[]
  sections: ContentServiceEntrySectionDto[]
}

export type ContentResourcePayloadDto =
  | ContentNoticePayloadDto
  | ContentHomeBannerPayloadDto
  | ContentActivityPayloadDto
  | ContentDropPayloadDto
  | ContentMarketItemPayloadDto
  | ContentAssetPayloadDto
  | ContentProfileAssetPayloadDto
  | ContentServiceEntryPayloadDto
  | ContentActionEntryPayloadDto
  | Record<string, never>

export interface ContentHomeBannerDto {
  bannerId: string
  title: string
  liveLabel: string
  tone: ContentHomeBannerTone
  asset: ContentAssetDto
  target: ContentTargetDto
}

export interface ContentFeaturedDropDto {
  dropId: string
  title: string
  sectionTitle: string
  sectionSubtitle: string
  priceLabel: string
  currency: string
  priceInCent: number
  mintedCount: number
  supplyCount: number
  asset?: ContentAssetDto | null
  placeholderIconKey?: ContentPlaceholderIconKey
  target: ContentTargetDto
}

export interface ContentCategorySummaryDto {
  categoryId: string
  categoryName: string
}

export interface ContentMarketActionDto {
  actionId: ContentMarketActionId
  label: string
  target: ContentTargetDto
}

export interface ContentMarketItemSummaryDto {
  itemId: string
  title: string
  currency: string
  priceInCent: number
  categoryIds: string[]
  asset?: ContentAssetDto | null
  placeholderIconKey?: ContentPlaceholderIconKey
  visualTone: ContentMarketVisualTone
  badgeType?: ContentMarketBadgeType
  badgeLabel?: string
  target: ContentTargetDto
}

export interface ContentNoticeBarBlockDto {
  blockType: 'notice_bar'
  label: string
  detailLabel: string
  items: ContentNoticeSummaryDto[]
}

export interface ContentBannerCarouselBlockDto {
  blockType: 'banner_carousel'
  items: ContentHomeBannerDto[]
}

export interface ContentFeaturedDropBlockDto {
  blockType: 'featured_drop'
  item: ContentFeaturedDropDto
}

export interface ContentMarketOverviewBlockDto {
  blockType: 'market_overview'
  sectionTitle: string
  sectionSubtitle: string
  categories: ContentCategorySummaryDto[]
  actions: ContentMarketActionDto[]
  items: ContentMarketItemSummaryDto[]
}

export interface ContentActivityEntryDto {
  entryId: string
  title: string
  eyebrow: string
  description: string
  tone: ContentActivityEntryTone
  badgeLabel?: string
  target: ContentTargetDto
}

export interface ContentActivityEntriesBlockDto {
  blockType: 'activity_entries'
  items: ContentActivityEntryDto[]
}

export interface ContentActivityNoticeFeedBlockDto {
  blockType: 'activity_notice_feed'
  tags: string[]
  items: ContentNoticeSummaryDto[]
}

export interface ContentProfileSummaryBlockDto {
  blockType: 'profile_summary'
  displayName: string
  address: string
  currency: string
  totalValueInCent: number
  holdingsCount: number
}

export interface ContentProfileAssetCategoryDto {
  categoryId: ContentProfileCategoryId
  categoryName: string
}

export interface ContentProfileAssetItemDto {
  itemId: string
  title: string
  acquiredAt: string
  subCategory: string
  categoryId: ContentProfileCategoryId
}

export interface ContentProfileAssetsBlockDto {
  blockType: 'profile_assets'
  categories: ContentProfileAssetCategoryDto[]
  subCategories: string[]
  items: ContentProfileAssetItemDto[]
}

export interface ContentSettingsSummaryBlockDto {
  blockType: 'settings_summary'
  title: string
  englishTitle: string
  description: string
  actionLabel: string
  actionEnglishLabel: string
  actionTarget: ContentTargetDto
}

export interface ContentSettingsItemDto {
  itemId: string
  title: string
  value: string
  target: ContentTargetDto
}

export interface ContentSettingsSectionDto {
  sectionId: string
  title: string
  englishTitle: string
  items: ContentSettingsItemDto[]
}

export interface ContentSettingsSectionsBlockDto {
  blockType: 'settings_sections'
  sections: ContentSettingsSectionDto[]
}

export interface ContentServiceHubEntryReminderDto {
  serviceId: ContentServiceEntryId
  hasReminder: boolean
  unreadCount: number
  indicatorTone: ContentServiceHubIndicatorTone
  latestMessageId?: string
  latestMessageAt?: string
}

export interface ContentServiceHubEntriesBlockDto {
  blockType: 'service_hub_entries'
  items: ContentServiceHubEntryReminderDto[]
}

export type ContentSceneBlockDto =
  | ContentNoticeBarBlockDto
  | ContentBannerCarouselBlockDto
  | ContentFeaturedDropBlockDto
  | ContentMarketOverviewBlockDto
  | ContentActivityEntriesBlockDto
  | ContentActivityNoticeFeedBlockDto
  | ContentProfileSummaryBlockDto
  | ContentProfileAssetsBlockDto
  | ContentSettingsSummaryBlockDto
  | ContentSettingsSectionsBlockDto
  | ContentServiceHubEntriesBlockDto

export interface ContentSceneDto {
  sceneId: ContentSceneId
  version: number
  updatedAt: string
  blocks: ContentSceneBlockDto[]
}

export interface ContentRelationDto {
  relationType: string
  target: ContentTargetDto
}

export interface ContentResourceDto {
  resourceType: ContentResourceType
  resourceId: string
  title: string
  subtitle?: string
  status: string
  updatedAt: string
  summary?: string
  asset?: ContentAssetDto | null
  payload: ContentResourcePayloadDto
  relations: ContentRelationDto[]
}

export interface ContentListItemDto {
  resourceType: ContentResourceType
  resourceId: string
  title: string
  status: string
  updatedAt: string
  summary?: string
  asset?: ContentAssetDto | null
  target: ContentTargetDto
  payload: ContentResourcePayloadDto
}

export interface ContentListDto {
  resourceType: ContentResourceType
  page: number
  pageSize: number
  total: number
  items: ContentListItemDto[]
}

export interface ContentSceneRequestDto {
  sceneId: ContentSceneId
  platform?: string
  channel?: string
  locale?: string
}

export interface ContentResourceRequestDto {
  resourceType: ContentResourceType
  resourceId: string
}

export interface ContentListRequestDto {
  resourceType: ContentResourceType
  categoryId?: string
  keyword?: string
  sortBy?: string
  page: number
  pageSize: number
}

export interface NoticeReadActionRequestDto {
  actionType: 'notice-read'
  noticeId: string
}

export interface NoticeReadActionResultDto {
  noticeId: string
  isUnread: boolean
}

export interface ServiceReminderConsumeActionRequestDto {
  actionType: 'service-reminder-consume'
  serviceId: ContentServiceEntryId
  latestMessageId?: string
}

export interface ServiceReminderConsumeActionResultDto {
  serviceId: ContentServiceEntryId
  hasReminder: boolean
  unreadCount: number
  latestMessageId?: string
  latestMessageAt?: string
}

export type ContentActionRequestDto = NoticeReadActionRequestDto | ServiceReminderConsumeActionRequestDto
export type ContentActionResultDto = NoticeReadActionResultDto | ServiceReminderConsumeActionResultDto
