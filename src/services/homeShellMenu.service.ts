/**
 * 文件版本：v0001
 * 更新时间：2026-03-25 23:06:00
 * Encoding: UTF-8
 * 本次更新：下沉首页抽屉与窄侧栏正式入口配置，复用旧架构服务语义
 */

import { HOME_ACTIVITY_PAGE_KEY, HOME_PRIMARY_PAGE_KEY, HOME_PROFILE_PAGE_KEY } from '../models/homeShell.model'
import type {
  HomeShellDrawerEntry,
  HomeShellDrawerEntryId,
  HomeShellNavEntry,
  HomeShellServiceEntryId,
} from '../models/homeShellMenu.model'
import { buildHomeServiceEntryUrl, buildSettingsUrl } from './homeRailNavigation.service'

export type HomeShellEntrySource = 'shell-drawer' | 'profile-quick-action'

interface HomeShellDrawerEntryTemplate extends Omit<HomeShellDrawerEntry, 'routeUrl'> {}

const HOME_SHELL_DRAWER_ENTRY_TEMPLATES: ReadonlyArray<HomeShellDrawerEntryTemplate> = [
  {
    id: 'orders',
    label: '我的订单',
    englishLabel: 'Order Center',
    iconKey: 'history',
  },
  {
    id: 'auth',
    label: '实名认证',
    englishLabel: 'Identity Verify',
    iconKey: 'shield-check',
    badge: { label: '已认证', tone: 'success' },
  },
  {
    id: 'wallet',
    label: '钱包管理',
    englishLabel: 'Wallet',
    iconKey: 'wallet',
    badge: { label: '已开通', tone: 'info' },
  },
  {
    id: 'invite',
    label: '邀请好友',
    englishLabel: 'Invite Hub',
    iconKey: 'user-plus',
    badge: { label: '已邀', value: '12人', tone: 'accent' },
  },
  {
    id: 'community',
    label: '官方社群',
    englishLabel: 'Community',
    iconKey: 'users',
  },
  {
    id: 'settings',
    label: '系统设置',
    englishLabel: 'Settings',
    iconKey: 'settings',
  },
]

const HOME_SHELL_NAV_ENTRIES: ReadonlyArray<HomeShellNavEntry> = [
  { id: 'home', label: '首页', iconKey: 'house', pageKey: HOME_PRIMARY_PAGE_KEY },
  { id: 'activity', label: '活动页', iconKey: 'sparkles', pageKey: HOME_ACTIVITY_PAGE_KEY },
  { id: 'profile', label: '个人中心', iconKey: 'user-round', pageKey: HOME_PROFILE_PAGE_KEY },
  { id: 'settings', label: '系统设置', iconKey: 'settings', routeUrl: buildSettingsUrl('shell-nav-rail', 'account-security') },
]

const resolveHomeShellDrawerEntryRouteUrl = (entryId: HomeShellDrawerEntryId, source: HomeShellEntrySource): string => {
  if (entryId === 'settings') {
    return buildSettingsUrl(source, 'account-security')
  }

  return buildHomeServiceEntryUrl(entryId as HomeShellServiceEntryId, source)
}

const cloneDrawerEntry = (entry: HomeShellDrawerEntryTemplate, source: HomeShellEntrySource): HomeShellDrawerEntry => {
  return {
    ...entry,
    routeUrl: resolveHomeShellDrawerEntryRouteUrl(entry.id, source),
    badge: entry.badge ? { ...entry.badge } : undefined,
    indicator: entry.indicator ? { ...entry.indicator } : undefined,
  }
}

const cloneNavEntry = (entry: HomeShellNavEntry): HomeShellNavEntry => {
  return { ...entry }
}

export const resolveHomeShellDrawerEntries = (source: HomeShellEntrySource = 'shell-drawer'): HomeShellDrawerEntry[] => {
  return HOME_SHELL_DRAWER_ENTRY_TEMPLATES.map((entry) => cloneDrawerEntry(entry, source))
}

export const resolveHomeShellNavEntries = (): HomeShellNavEntry[] => {
  return HOME_SHELL_NAV_ENTRIES.map(cloneNavEntry)
}

