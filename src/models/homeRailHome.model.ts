/**
 * 文件版本：v0002
 * 更新时间：2026-03-25 12:24:00
 * Encoding: UTF-8
 * 本次更新：首页主轨内容模型升级为“图片资产 + 内容配置 + 跳转配置”结构
 */

export type HomeBannerTone = 'dawn' | 'azure' | 'ember'
export type HomeMarketBadgeTone = 'new' | 'hot' | 'featured'
export type HomeMarketVisualTone = 'ink' | 'mist' | 'aqua' | 'sand'
export type HomePlaceholderIconKey = 'box' | 'cpu' | 'aperture' | 'hexagon' | 'triangle' | 'disc3'
export type HomeContentTargetType = 'home_banner' | 'drop' | 'market_item' | 'market_action' | 'activity'

export interface HomeContentTargetRef {
  targetType: HomeContentTargetType
  targetId: string
}

export interface HomeNoticeBarConfig {
  label: string
  detailLabel: string
  items: HomeAnnouncementItem[]
}

export interface HomeFocalPoint {
  x: number
  y: number
}

export interface HomeAnnouncementItem {
  noticeId: string
  title: string
  type: string
  time: string
  isUnread: boolean
}

export interface HomeBannerItem {
  id: string
  title: string
  liveLabel: string
  tone: HomeBannerTone
  imageUrl: string
  focalPoint?: HomeFocalPoint
  target: HomeContentTargetRef
}

export interface HomeFeaturedDropContent {
  id: string
  title: string
  sectionTitle: string
  sectionSubtitle: string
  priceLabel: string
  priceUnit: string
  price: number
  minted: number
  supply: number
  imageUrl: string
  placeholderIconKey?: HomePlaceholderIconKey
  target: HomeContentTargetRef
}

export interface HomeMarketAction {
  id: 'search' | 'history'
  label: string
  target: HomeContentTargetRef
}

export interface HomeMarketTag {
  id: string
  label: string
}

export interface HomeMarketBadge {
  tone: HomeMarketBadgeTone
  label: string
}

export interface HomeMarketCard {
  id: string
  name: string
  priceUnit: string
  price: number
  categories: string[]
  imageUrl: string
  placeholderIconKey?: HomePlaceholderIconKey
  visualTone: HomeMarketVisualTone
  badge?: HomeMarketBadge
  target: HomeContentTargetRef
}

export interface HomeRailHomeContent {
  noticeBar: HomeNoticeBarConfig
  banners: HomeBannerItem[]
  featured: HomeFeaturedDropContent
  market: {
    sectionTitle: string
    sectionSubtitle: string
    tags: HomeMarketTag[]
    actions: HomeMarketAction[]
    cards: HomeMarketCard[]
  }
}
