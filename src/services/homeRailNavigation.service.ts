/**
 * 文件版本：v0004
 * 更新时间：2026-03-25 20:58:00
 * Encoding: UTF-8
 * 本次更新：补正式动作页路由，并清理首页与服务链路中的坏中文文案
 */

import type { ActivityEntry, ActivityNotice } from '../models/homeRailActivity.model'
import type { ContentTargetDto } from '../contracts/content-api.contract'
import type { PageKey } from '../models/homeShell.model'
import type { HomeContentTargetRef, HomeContentTargetType } from '../models/homeRailHome.model'
import type { ProfileCategoryKey } from '../models/homeRailProfile.model'
import type { HomeShellDrawerEntryId } from '../models/homeShellMenu.model'
import { buildRouteUrl } from '../utils/routeQuery.util'

interface HomeNoticeDetailUrlInput {
  noticeId: string
  title: string
  type: string
  status: string
  time: string
}

export const buildHomeNoticeDetailUrl = (input: HomeNoticeDetailUrlInput) => {
  return buildRouteUrl('/pages/notice-detail/index', {
    noticeId: input.noticeId,
    title: input.title,
    type: input.type,
    status: input.status,
    time: input.time,
    source: 'home-notice-bar',
  })
}

interface UpdatingTargetUrlInput {
  target: HomeContentTargetRef | ContentTargetDto
  title?: string
  source: string
}

interface UpdatingQueryMeta {
  moduleId: string
  title: string
  englishTitle: string
  statusLabel: string
  source: string
}

const resolveUpdatingMetaByTarget = (input: UpdatingTargetUrlInput): UpdatingQueryMeta => {
  const { target, title, source } = input

  const targetMetaMap: Record<HomeContentTargetType, (targetId: string, resolvedTitle: string, sourceValue: string) => UpdatingQueryMeta> = {
    home_banner: (targetId, resolvedTitle, sourceValue) => ({
      moduleId: `UPD-HOME-BANNER-${targetId.toUpperCase()}`,
      title: resolvedTitle || `${targetId} 主视觉链路`,
      englishTitle: 'Banner Pipeline',
      statusLabel: 'Construction',
      source: sourceValue,
    }),
    drop: (targetId, resolvedTitle, sourceValue) => ({
      moduleId: 'UPD-HOME-COLLECTION',
      title: resolvedTitle || `${targetId} 藏品链路`,
      englishTitle: 'Collection Pipeline',
      statusLabel: 'Construction',
      source: sourceValue,
    }),
    market_item: (targetId, resolvedTitle, sourceValue) => ({
      moduleId: `UPD-HOME-COL-${targetId.toUpperCase()}`,
      title: resolvedTitle || `${targetId} 交易链路`,
      englishTitle: 'Collection Pipeline',
      statusLabel: 'Construction',
      source: sourceValue,
    }),
    market_action: (targetId, resolvedTitle, sourceValue) => ({
      moduleId: targetId === 'search' ? 'UPD-HOME-MARKET-SEARCH' : 'UPD-HOME-MARKET-DOCS',
      title: resolvedTitle || (targetId === 'search' ? '藏品市场搜索' : '藏品市场文档'),
      englishTitle: targetId === 'search' ? 'Market Search' : 'Market Docs',
      statusLabel: 'Construction',
      source: sourceValue,
    }),
    activity: (targetId, resolvedTitle, sourceValue) => ({
      moduleId: `UPD-ACT-${targetId.toUpperCase()}`,
      title: resolvedTitle || `${targetId} 活动链路`,
      englishTitle: 'Activity Pipeline',
      statusLabel: 'Construction',
      source: sourceValue,
    }),
  }

  return targetMetaMap[target.targetType as HomeContentTargetType](target.targetId, title?.trim() ?? '', source)
}

export const buildUpdatingUrlByTarget = (input: UpdatingTargetUrlInput) => {
  const meta = resolveUpdatingMetaByTarget(input)
  return buildRouteUrl('/pages/updating/index', { ...meta })
}

export const buildActionEntryUrl = (
  target: ContentTargetDto | { targetType: 'market_action' | 'service_action' | 'settings_action'; targetId: string },
  source: string,
) => {
  if (target.targetType !== 'market_action' && target.targetType !== 'service_action' && target.targetType !== 'settings_action') {
    return buildUpdatingUrlByTarget({
      target,
      source,
    })
  }

  return buildRouteUrl('/pages/action-entry/index', {
    resourceType: target.targetType,
    actionId: target.targetId,
    source,
  })
}

export const buildContentResourceUrl = (
  target: ContentTargetDto | { targetType: 'home_banner' | 'activity' | 'drop' | 'market_item'; targetId: string },
  source: string,
) => {
  if (target.targetType !== 'home_banner' && target.targetType !== 'activity' && target.targetType !== 'drop' && target.targetType !== 'market_item') {
    return buildUpdatingUrlByTarget({
      target,
      source,
    })
  }

  return buildRouteUrl('/pages/content-resource/index', {
    resourceType: target.targetType,
    resourceId: target.targetId,
    source,
  })
}

export const buildHomeBannerUpdatingUrl = () => {
  return buildRouteUrl('/pages/updating/index', {
    moduleId: 'UPD-HOME-BANNER',
    title: '合成黎明主视觉链路',
    englishTitle: 'Banner Pipeline',
    statusLabel: 'Construction',
    source: 'home-banner',
  })
}

export const buildHomeCollectionUpdatingUrl = () => {
  return buildRouteUrl('/pages/updating/index', {
    moduleId: 'UPD-HOME-COLLECTION',
    title: '首发藏品交易链路',
    englishTitle: 'Collection Pipeline',
    statusLabel: 'Construction',
    source: 'home-collection',
  })
}

export const buildActivityUpdatingUrl = (entry: ActivityEntry) => {
  return buildRouteUrl('/pages/updating/index', {
    moduleId: `UPD-ACT-${entry.id.toUpperCase()}`,
    title: entry.title,
    englishTitle: 'Activity Pipeline',
    statusLabel: 'Construction',
    source: 'activity-entry',
  })
}

export const buildActivityNoticeDetailUrl = (notice: ActivityNotice) => {
  return buildRouteUrl('/pages/notice-detail/index', {
    noticeId: notice.id,
    title: notice.title,
    type: notice.type,
    status: 'LIVE',
    time: notice.time,
    source: 'activity-notice-list',
  })
}

export const buildProfileSettingsUrl = () => {
  return buildSettingsUrl('profile-panel', 'account-security')
}

export const buildProfileUpdatingUrl = () => {
  return buildRouteUrl('/pages/updating/index', {
    moduleId: 'UPD-PROFILE-SYNC',
    title: '账户同步与资产校验',
    englishTitle: 'Profile Sync Pipeline',
    statusLabel: 'Construction',
    source: 'profile-panel',
  })
}

export const buildProfileAddressQrUrl = () => {
  return buildRouteUrl('/pages/profile-address/index', {
    source: 'profile-address-qr',
  })
}

export const buildProfileAssetSearchUrl = () => {
  return buildRouteUrl('/pages/profile-assets/index', {
    source: 'profile-asset-search',
    category: 'all',
    keyword: '',
  })
}

export const buildProfileAssetDetailUrl = (assetId: string, category: ProfileCategoryKey, _title?: string) => {
  return buildRouteUrl('/pages/profile-asset-detail/index', {
    source: 'profile-asset-card',
    assetId,
    category,
  })
}

export const buildSettingsUrl = (source: string, section = 'account-security') => {
  return buildRouteUrl('/pages/settings/index', {
    source,
    section,
  })
}

export const buildHomeShellPageUrl = (page: PageKey, source: string) => {
  return buildRouteUrl('/pages/home/index', {
    tab: page,
    source,
  })
}

export const buildHomeServiceEntryUrl = (entryId: HomeShellDrawerEntryId, source: string) => {
  if (entryId === 'settings') {
    return buildSettingsUrl(source, 'account-security')
  }

  return buildRouteUrl('/pages/service-entry/index', {
    serviceId: entryId,
    source,
  })
}
