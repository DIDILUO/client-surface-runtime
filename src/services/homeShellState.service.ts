/**
 * 文件版本：v0007
 * 更新时间：2026-03-23 22:52:00
 * Encoding: UTF-8
 * 本次更新：新增壳层派生状态聚合函数，统一可见页/活动态/抽屉能力输出
 */

import {
  HOME_ACTIVITY_PAGE_KEY,
  HOME_PRIMARY_PAGE_KEY,
  HOME_PROFILE_PAGE_KEY,
  HOME_SHELL_PAGE_KEYS,
  type LayoutMode,
  type PageKey,
  type SecondaryPageKey,
} from '../models/homeShell.model'
import {
  canUseDrawerInLayoutMode,
  isDoubleLayoutMode,
  isSingleLayoutMode,
} from './homeShellLayoutMode.service'

export const isHomePrimaryPageKey = (pageKey: PageKey): boolean => {
  return pageKey === HOME_PRIMARY_PAGE_KEY
}

export const resolveSecondaryPageKey = (pageKey: PageKey): SecondaryPageKey => {
  return pageKey === HOME_PROFILE_PAGE_KEY ? HOME_PROFILE_PAGE_KEY : HOME_ACTIVITY_PAGE_KEY
}

export const resolveHomeShellVisiblePages = (
  layoutMode: LayoutMode,
  singleModeTab: PageKey,
  doubleSecondaryTab: SecondaryPageKey,
): PageKey[] => {
  if (isSingleLayoutMode(layoutMode)) {
    return [singleModeTab]
  }

  if (isDoubleLayoutMode(layoutMode)) {
    return [HOME_PRIMARY_PAGE_KEY, doubleSecondaryTab]
  }

  return [...HOME_SHELL_PAGE_KEYS]
}

export interface HomeShellTabActivityFlags {
  isHomeTabActive: boolean
  isActivityTabActive: boolean
  isProfileTabActive: boolean
}

export const resolveHomeShellTabActivityFlags = (
  layoutMode: LayoutMode,
  singleModeTab: PageKey,
  doubleSecondaryTab: SecondaryPageKey,
): HomeShellTabActivityFlags => {
  if (isSingleLayoutMode(layoutMode)) {
    return {
      isHomeTabActive: isHomePrimaryPageKey(singleModeTab),
      isActivityTabActive: singleModeTab === HOME_ACTIVITY_PAGE_KEY,
      isProfileTabActive: singleModeTab === HOME_PROFILE_PAGE_KEY,
    }
  }

  return {
    isHomeTabActive: true,
    isActivityTabActive: doubleSecondaryTab === HOME_ACTIVITY_PAGE_KEY,
    isProfileTabActive: doubleSecondaryTab === HOME_PROFILE_PAGE_KEY,
  }
}

export interface HomeShellDerivedState {
  canUseDrawer: boolean
  tabActivityFlags: HomeShellTabActivityFlags
  visiblePages: PageKey[]
}

export const resolveHomeShellDerivedState = (
  layoutMode: LayoutMode,
  singleModeTab: PageKey,
  doubleSecondaryTab: SecondaryPageKey,
): HomeShellDerivedState => {
  return {
    canUseDrawer: canUseDrawerInLayoutMode(layoutMode),
    tabActivityFlags: resolveHomeShellTabActivityFlags(layoutMode, singleModeTab, doubleSecondaryTab),
    visiblePages: resolveHomeShellVisiblePages(layoutMode, singleModeTab, doubleSecondaryTab),
  }
}

interface HomeShellLayoutTransitionInput {
  previousLayoutMode: LayoutMode
  nextLayoutMode: LayoutMode
  singleModeTab: PageKey
  doubleSecondaryTab: SecondaryPageKey
}

interface HomeShellLayoutTransitionResult {
  nextSingleModeTab: PageKey
  nextDoubleSecondaryTab: SecondaryPageKey
  shouldCloseDrawer: boolean
}

export const resolveHomeShellStateOnLayoutChange = (
  input: HomeShellLayoutTransitionInput,
): HomeShellLayoutTransitionResult => {
  let nextSingleModeTab = input.singleModeTab
  let nextDoubleSecondaryTab = input.doubleSecondaryTab
  const shouldCloseDrawer = !isSingleLayoutMode(input.nextLayoutMode)

  if (isDoubleLayoutMode(input.nextLayoutMode) && !isHomePrimaryPageKey(input.singleModeTab)) {
    nextDoubleSecondaryTab = resolveSecondaryPageKey(input.singleModeTab)
  }

  if (isDoubleLayoutMode(input.previousLayoutMode) && isSingleLayoutMode(input.nextLayoutMode)) {
    nextSingleModeTab = input.doubleSecondaryTab
  }

  return {
    nextSingleModeTab,
    nextDoubleSecondaryTab,
    shouldCloseDrawer,
  }
}

interface HomeShellTabChangeInput {
  layoutMode: LayoutMode
  currentSingleModeTab: PageKey
  currentDoubleSecondaryTab: SecondaryPageKey
  nextTab: PageKey
}

interface HomeShellTabChangeResult {
  nextSingleModeTab: PageKey
  nextDoubleSecondaryTab: SecondaryPageKey
}

export const resolveHomeShellStateOnTabChange = (
  input: HomeShellTabChangeInput,
): HomeShellTabChangeResult => {
  let nextSingleModeTab = input.currentSingleModeTab
  let nextDoubleSecondaryTab = input.currentDoubleSecondaryTab

  if (isSingleLayoutMode(input.layoutMode)) {
    nextSingleModeTab = input.nextTab
  } else if (isDoubleLayoutMode(input.layoutMode) && !isHomePrimaryPageKey(input.nextTab)) {
    nextDoubleSecondaryTab = resolveSecondaryPageKey(input.nextTab)
  }

  return {
    nextSingleModeTab,
    nextDoubleSecondaryTab,
  }
}
