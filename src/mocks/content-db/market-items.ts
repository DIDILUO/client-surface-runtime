import type {
  ContentMarketBadgeType,
  ContentMarketVisualTone,
  ContentPlaceholderIconKey,
} from '../../contracts/content-api.contract'

export interface ContentMarketItemRecord {
  itemId: string
  title: string
  currency: string
  priceInCent: number
  categoryIds: string[]
  assetId?: string | null
  placeholderIconKey?: ContentPlaceholderIconKey
  visualTone: ContentMarketVisualTone
  badgeType?: ContentMarketBadgeType
  badgeLabel?: string
  status: 'online'
  updatedAt: string
  summary: string
}

export const contentMarketItemDb: ContentMarketItemRecord[] = [
  {
    itemId: 'C-01',
    title: '浮光构件',
    currency: 'CNY',
    priceInCent: 45000,
    categoryIds: ['3d-component', 'digital-art'],
    assetId: null,
    placeholderIconKey: 'cpu',
    visualTone: 'aqua',
    badgeType: 'hot',
    badgeLabel: 'HOT',
    status: 'online',
    updatedAt: '2026-03-25T12:24:00+08:00',
    summary: '首页市场卡片摘要，详情页后续按 market_item 统一拉取。',
  },
  {
    itemId: 'C-02',
    title: '相位凭证',
    currency: 'CNY',
    priceInCent: 52000,
    categoryIds: ['equity-certificate', 'digital-art'],
    assetId: null,
    placeholderIconKey: 'hexagon',
    visualTone: 'mist',
    badgeType: 'new',
    badgeLabel: 'NEW',
    status: 'online',
    updatedAt: '2026-03-25T12:24:00+08:00',
    summary: '首页市场卡片摘要，后续接详情与筛选列表。',
  },
  {
    itemId: 'C-03',
    title: '巡演票根',
    currency: 'CNY',
    priceInCent: 38800,
    categoryIds: ['music-scene', 'virtual-wear'],
    assetId: null,
    placeholderIconKey: 'disc3',
    visualTone: 'sand',
    status: 'online',
    updatedAt: '2026-03-25T12:24:00+08:00',
    summary: '首页市场卡片摘要，后续接详情与筛选列表。',
  },
  {
    itemId: 'C-04',
    title: '拟态护符',
    currency: 'CNY',
    priceInCent: 61000,
    categoryIds: ['virtual-wear', 'equity-certificate'],
    assetId: null,
    placeholderIconKey: 'triangle',
    visualTone: 'ink',
    badgeType: 'featured',
    badgeLabel: '精选',
    status: 'online',
    updatedAt: '2026-03-25T12:24:00+08:00',
    summary: '首页市场卡片摘要，后续接详情与筛选列表。',
  },
]
