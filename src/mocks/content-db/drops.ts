import type { ContentPlaceholderIconKey } from '../../contracts/content-api.contract'

export interface ContentDropRecord {
  dropId: string
  title: string
  subtitle: string
  sectionTitle: string
  sectionSubtitle: string
  priceLabel: string
  currency: string
  priceInCent: number
  mintedCount: number
  supplyCount: number
  assetId?: string | null
  placeholderIconKey?: ContentPlaceholderIconKey
  status: 'online'
  updatedAt: string
  summary: string
}

export const contentDropDb: ContentDropRecord[] = [
  {
    dropId: 'AX-99',
    title: '合成黎明',
    subtitle: 'FEATURED DROP',
    sectionTitle: '首发藏品',
    sectionSubtitle: 'Featured Drop',
    priceLabel: '铸造价格',
    currency: 'CNY',
    priceInCent: 89900,
    mintedCount: 428,
    supplyCount: 1000,
    assetId: null,
    placeholderIconKey: 'box',
    status: 'online',
    updatedAt: '2026-03-25T12:24:00+08:00',
    summary: '首页首发藏品摘要，详情页将按 dropId 继续拉全量内容。',
  },
]
