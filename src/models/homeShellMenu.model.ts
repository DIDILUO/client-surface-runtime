/**
 * 文件版本：v0001
 * 更新时间：2026-03-25 23:06:00
 * Encoding: UTF-8
 * 本次更新：定义首页抽屉与窄侧栏的正式入口模型，替代壳层灰块占位
 */

import type { PageKey } from './homeShell.model'

export type HomeShellBadgeTone = 'success' | 'info' | 'accent'
export type HomeShellIndicatorTone = 'cyan' | 'green' | 'amber' | 'rose' | 'red'
export type HomeShellIconKey =
  | 'history'
  | 'shield-check'
  | 'wallet'
  | 'user-plus'
  | 'users'
  | 'settings'
  | 'house'
  | 'sparkles'
  | 'user-round'

export type HomeShellDrawerEntryId = 'orders' | 'auth' | 'wallet' | 'invite' | 'community' | 'settings'
export type HomeShellNavEntryId = 'home' | 'activity' | 'profile' | 'settings'
export type HomeShellServiceEntryId = Exclude<HomeShellDrawerEntryId, 'settings'>

export interface HomeShellEntryBadge {
  label: string
  value?: string
  tone: HomeShellBadgeTone
}

export interface HomeShellEntryIndicator {
  visible: boolean
  tone: HomeShellIndicatorTone
}

export interface HomeShellServiceReminderState {
  serviceId: HomeShellServiceEntryId
  hasReminder: boolean
  unreadCount: number
  indicatorTone: HomeShellIndicatorTone
  latestMessageId?: string
  latestMessageAt?: string
}

export interface HomeShellDrawerEntry {
  id: HomeShellDrawerEntryId
  label: string
  englishLabel: string
  iconKey: HomeShellIconKey
  routeUrl: string
  badge?: HomeShellEntryBadge
  indicator?: HomeShellEntryIndicator
}

export interface HomeShellNavEntry {
  id: HomeShellNavEntryId
  label: string
  iconKey: HomeShellIconKey
  pageKey?: PageKey
  routeUrl?: string
}
