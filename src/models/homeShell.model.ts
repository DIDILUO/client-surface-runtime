/**
 * 文件版本：v0005
 * 更新时间：2026-03-24 16:45:00
 * Encoding: UTF-8
 * 本次更新：收口手机端标准侧边栏阈值，侧栏模式从 451px 起生效
 */

export const HOME_SHELL_PAGE_KEYS = ['home', 'activity', 'profile'] as const
export type PageKey = (typeof HOME_SHELL_PAGE_KEYS)[number]
export type SecondaryPageKey = Exclude<PageKey, 'home'>
export const HOME_PRIMARY_PAGE_KEY: PageKey = 'home'
export const HOME_ACTIVITY_PAGE_KEY: SecondaryPageKey = 'activity'
export const HOME_PROFILE_PAGE_KEY: SecondaryPageKey = 'profile'
export const HOME_DEFAULT_SECONDARY_PAGE_KEY: SecondaryPageKey = 'activity'

export const HOME_LAYOUT_MODE_SINGLE_PAGE = 'single-page'
export const HOME_LAYOUT_MODE_SINGLE_PAGE_WITH_NAV = 'single-page-with-nav'
export const HOME_LAYOUT_MODE_DOUBLE_PAGE = 'double-page'
export const HOME_LAYOUT_MODE_TRIPLE_PAGE = 'triple-page'
export const HOME_LAYOUT_MODE_TRIPLE_PAGE_WITH_STAGE = 'triple-page-with-stage'
export const HOME_LAYOUT_PAGE_MAX_WIDTH = 430
export const HOME_LAYOUT_NAV_RAIL_WIDTH = 76
export const HOME_LAYOUT_NAV_GAP = 12
export const HOME_LAYOUT_MIN_NAV_WIDTH =
  HOME_LAYOUT_PAGE_MAX_WIDTH + (HOME_LAYOUT_NAV_RAIL_WIDTH + HOME_LAYOUT_NAV_GAP) * 2
export const HOME_LAYOUT_MIN_DOUBLE_WIDTH = 750
export const HOME_LAYOUT_MIN_TRIPLE_WIDTH = 1125
export const HOME_LAYOUT_STAGE_FILL_THRESHOLD = 1290

export const HOME_SHELL_LAYOUT_MODES = [
  HOME_LAYOUT_MODE_SINGLE_PAGE,
  HOME_LAYOUT_MODE_SINGLE_PAGE_WITH_NAV,
  HOME_LAYOUT_MODE_DOUBLE_PAGE,
  HOME_LAYOUT_MODE_TRIPLE_PAGE,
  HOME_LAYOUT_MODE_TRIPLE_PAGE_WITH_STAGE,
] as const
export type LayoutMode = (typeof HOME_SHELL_LAYOUT_MODES)[number]
