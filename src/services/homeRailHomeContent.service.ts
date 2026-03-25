import type {
  ContentAssetDto,
  ContentBannerCarouselBlockDto,
  ContentFeaturedDropBlockDto,
  ContentMarketOverviewBlockDto,
  ContentNoticeBarBlockDto,
  ContentSceneDto,
} from '../contracts/content-api.contract'
import type {
  HomeAnnouncementItem,
  HomeBannerItem,
  HomeContentTargetRef,
  HomeFeaturedDropContent,
  HomeMarketAction,
  HomeMarketCard,
  HomeMarketTag,
  HomeNoticeBarConfig,
  HomeRailHomeContent,
} from '../models/homeRailHome.model'
import { createContentSceneSnapshot } from '../implementations/content.mock'
import { resolveContentScene } from './content.service'

const homeRailHomeContentShell: HomeRailHomeContent = {
  noticeBar: {
    label: '公告：',
    detailLabel: '查看公告详情',
    items: [],
  },
  banners: [],
  featured: {
    id: '',
    title: '',
    sectionTitle: '首发藏品',
    sectionSubtitle: 'Featured Drop',
    priceLabel: '铸造价格',
    priceUnit: '￥',
    price: 0,
    minted: 0,
    supply: 0,
    imageUrl: '',
    placeholderIconKey: 'box',
    target: {
      targetType: 'drop',
      targetId: '',
    },
  },
  market: {
    sectionTitle: '藏品市场',
    sectionSubtitle: 'Market Flow',
    tags: [],
    actions: [],
    cards: [],
  },
}

const cloneHomeRailHomeContentShell = (): HomeRailHomeContent => ({
  noticeBar: {
    ...homeRailHomeContentShell.noticeBar,
    items: [...homeRailHomeContentShell.noticeBar.items],
  },
  banners: [...homeRailHomeContentShell.banners],
  featured: {
    ...homeRailHomeContentShell.featured,
    target: { ...homeRailHomeContentShell.featured.target },
  },
  market: {
    sectionTitle: homeRailHomeContentShell.market.sectionTitle,
    sectionSubtitle: homeRailHomeContentShell.market.sectionSubtitle,
    tags: [...homeRailHomeContentShell.market.tags],
    actions: [...homeRailHomeContentShell.market.actions],
    cards: [...homeRailHomeContentShell.market.cards],
  },
})

const resolveAssetUrl = (asset: ContentAssetDto | null | undefined, variant: 'banner' | 'card'): string => {
  if (!asset) {
    return ''
  }

  if (variant === 'banner') {
    return asset.variants?.banner ?? asset.originalUrl
  }

  return asset.variants?.card ?? asset.originalUrl
}

const resolveCurrencyUnit = (currency: string): string => (currency === 'CNY' ? '￥' : currency)
const toHomeTarget = (target: { targetType: string; targetId: string }): HomeContentTargetRef => ({
  targetType: target.targetType as HomeContentTargetRef['targetType'],
  targetId: target.targetId,
})

const mapNoticeBar = (block?: ContentNoticeBarBlockDto): HomeNoticeBarConfig => {
  if (!block) {
    return {
      ...homeRailHomeContentShell.noticeBar,
      items: [...homeRailHomeContentShell.noticeBar.items],
    }
  }

  return {
    label: block.label,
    detailLabel: block.detailLabel,
    items: block.items.map<HomeAnnouncementItem>((item) => ({
      noticeId: item.noticeId,
      title: item.title,
      type: item.type,
      time: item.time,
      isUnread: item.isUnread,
    })),
  }
}

const mapBanners = (block?: ContentBannerCarouselBlockDto): HomeBannerItem[] => {
  if (!block) {
    return []
  }

  return block.items.map((item) => ({
    id: item.bannerId,
    title: item.title,
    liveLabel: item.liveLabel,
    tone: item.tone,
    imageUrl: resolveAssetUrl(item.asset, 'banner'),
    focalPoint: item.asset?.focalPoint ? { ...item.asset.focalPoint } : undefined,
    target: toHomeTarget(item.target),
  }))
}

const mapFeatured = (block?: ContentFeaturedDropBlockDto): HomeFeaturedDropContent => {
  if (!block) {
    return {
      ...homeRailHomeContentShell.featured,
      target: { ...homeRailHomeContentShell.featured.target },
    }
  }

  return {
    id: block.item.dropId,
    title: block.item.title,
    sectionTitle: block.item.sectionTitle,
    sectionSubtitle: block.item.sectionSubtitle,
    priceLabel: block.item.priceLabel,
    priceUnit: resolveCurrencyUnit(block.item.currency),
    price: Math.round(block.item.priceInCent / 100),
    minted: block.item.mintedCount,
    supply: block.item.supplyCount,
    imageUrl: resolveAssetUrl(block.item.asset, 'card'),
    placeholderIconKey: block.item.placeholderIconKey,
    target: toHomeTarget(block.item.target),
  }
}

const mapMarketTags = (block?: ContentMarketOverviewBlockDto): HomeMarketTag[] => {
  if (!block) {
    return []
  }

  return block.categories.map((item) => ({
    id: item.categoryId,
    label: item.categoryName,
  }))
}

const mapMarketActions = (block?: ContentMarketOverviewBlockDto): HomeMarketAction[] => {
  if (!block) {
    return []
  }

  return block.actions.map((item) => ({
    id: item.actionId,
    label: item.label,
    target: toHomeTarget(item.target),
  }))
}

const mapMarketCards = (block?: ContentMarketOverviewBlockDto): HomeMarketCard[] => {
  if (!block) {
    return []
  }

  return block.items.map((item) => ({
    id: item.itemId,
    name: item.title,
    priceUnit: resolveCurrencyUnit(item.currency),
    price: Math.round(item.priceInCent / 100),
    categories: [...item.categoryIds],
    imageUrl: resolveAssetUrl(item.asset, 'card'),
    placeholderIconKey: item.placeholderIconKey,
    visualTone: item.visualTone,
    badge: item.badgeType && item.badgeLabel ? { tone: item.badgeType, label: item.badgeLabel } : undefined,
    target: toHomeTarget(item.target),
  }))
}

const adaptHomeSceneToContent = (scene: ContentSceneDto): HomeRailHomeContent => {
  const noticeBarBlock = scene.blocks.find((item) => item.blockType === 'notice_bar') as ContentNoticeBarBlockDto | undefined
  const bannerBlock = scene.blocks.find((item) => item.blockType === 'banner_carousel') as ContentBannerCarouselBlockDto | undefined
  const featuredBlock = scene.blocks.find((item) => item.blockType === 'featured_drop') as ContentFeaturedDropBlockDto | undefined
  const marketBlock = scene.blocks.find((item) => item.blockType === 'market_overview') as ContentMarketOverviewBlockDto | undefined

  return {
    noticeBar: mapNoticeBar(noticeBarBlock),
    banners: mapBanners(bannerBlock),
    featured: mapFeatured(featuredBlock),
    market: {
      sectionTitle: marketBlock?.sectionTitle ?? homeRailHomeContentShell.market.sectionTitle,
      sectionSubtitle: marketBlock?.sectionSubtitle ?? homeRailHomeContentShell.market.sectionSubtitle,
      tags: mapMarketTags(marketBlock),
      actions: mapMarketActions(marketBlock),
      cards: mapMarketCards(marketBlock),
    },
  }
}

export const createHomeRailHomeContentShell = (): HomeRailHomeContent => {
  const scene = createContentSceneSnapshot('home')
  return scene ? adaptHomeSceneToContent(scene) : cloneHomeRailHomeContentShell()
}

export const resolveHomeRailHomeContent = async (): Promise<HomeRailHomeContent> => {
  const scene = await resolveContentScene({ sceneId: 'home' })
  return adaptHomeSceneToContent(scene)
}
