import type {
  ContentMarketBadgeType,
  ContentMarketVisualTone,
  ContentPlaceholderIconKey,
  ContentResourceType,
} from '../contracts/content-api.contract'

export interface ContentResourceDetailStat {
  id: string
  label: string
  value: string
  caption?: string
}

export interface ContentResourceDetailBadge {
  id: string
  label: string
  tone: 'slate' | 'cyan' | 'amber' | 'rose'
}

export interface ContentResourceDetailContent {
  resourceType: Extract<ContentResourceType, 'home_banner' | 'activity' | 'drop' | 'market_item'>
  resourceId: string
  title: string
  subtitle: string
  statusLabel: string
  summary: string
  englishTitle: string
  imageUrl: string
  placeholderIconKey: ContentPlaceholderIconKey
  priceLabel: string
  priceUnit: string
  priceValue: string
  progressRate: number
  progressLabel: string
  visualTone: ContentMarketVisualTone | 'slate'
  badges: ContentResourceDetailBadge[]
  stats: ContentResourceDetailStat[]
  relationNote: string
}

export const contentResourceBadgeToneMap: Record<ContentMarketBadgeType, ContentResourceDetailBadge['tone']> = {
  new: 'rose',
  hot: 'amber',
  featured: 'cyan',
}
