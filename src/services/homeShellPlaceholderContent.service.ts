/**
 * 文件版本：v0001
 * 更新时间：2026-03-23 17:35:20
 * Encoding: UTF-8
 * 本次更新：下沉首页壳层占位项预设数据，统一抽屉与导航轨道内容来源
 */

import type { HomeShellPlaceholderItem } from '../models/homeShellPlaceholder.model'

const HOME_SHELL_DRAWER_ITEMS: ReadonlyArray<HomeShellPlaceholderItem> = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
]

const HOME_SHELL_NAV_ITEMS: ReadonlyArray<HomeShellPlaceholderItem> = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
]

const cloneItems = (items: ReadonlyArray<HomeShellPlaceholderItem>): HomeShellPlaceholderItem[] => {
  return items.map((item) => ({ ...item }))
}

export const getHomeShellDrawerItems = (): HomeShellPlaceholderItem[] => {
  return cloneItems(HOME_SHELL_DRAWER_ITEMS)
}

export const getHomeShellNavItems = (): HomeShellPlaceholderItem[] => {
  return cloneItems(HOME_SHELL_NAV_ITEMS)
}
