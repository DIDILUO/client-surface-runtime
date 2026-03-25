/**
 * 文件版本：v0001
 * 更新时间：2026-03-23 15:40:10
 * Encoding: UTF-8
 * 本次更新：新增页面路由参数模型与白名单键定义
 */

export const updatingRouteQueryKeys = [
  'moduleId',
  'title',
  'englishTitle',
  'statusLabel',
  'source',
] as const

export type UpdatingRouteQueryKey = (typeof updatingRouteQueryKeys)[number]

export type UpdatingRouteQuery = Record<UpdatingRouteQueryKey, string>

export const noticeDetailRouteQueryKeys = [
  'noticeId',
  'type',
  'status',
  'time',
  'title',
  'source',
] as const

export type NoticeDetailRouteQueryKey = (typeof noticeDetailRouteQueryKeys)[number]

export type NoticeDetailRouteQuery = Record<NoticeDetailRouteQueryKey, string>

export const settingsRouteQueryKeys = ['source', 'section'] as const

export type SettingsRouteQueryKey = (typeof settingsRouteQueryKeys)[number]

export type SettingsRouteQuery = Record<SettingsRouteQueryKey, string>

export const serviceEntryRouteQueryKeys = ['serviceId', 'source'] as const

export type ServiceEntryRouteQueryKey = (typeof serviceEntryRouteQueryKeys)[number]

export type ServiceEntryRouteQuery = Record<ServiceEntryRouteQueryKey, string>

export const actionEntryRouteQueryKeys = ['resourceType', 'actionId', 'source'] as const

export type ActionEntryRouteQueryKey = (typeof actionEntryRouteQueryKeys)[number]

export type ActionEntryRouteQuery = Record<ActionEntryRouteQueryKey, string>

export const contentResourceRouteQueryKeys = ['resourceType', 'resourceId', 'source'] as const

export type ContentResourceRouteQueryKey = (typeof contentResourceRouteQueryKeys)[number]

export type ContentResourceRouteQuery = Record<ContentResourceRouteQueryKey, string>

export const profileAddressRouteQueryKeys = ['source'] as const

export type ProfileAddressRouteQueryKey = (typeof profileAddressRouteQueryKeys)[number]

export type ProfileAddressRouteQuery = Record<ProfileAddressRouteQueryKey, string>

export const profileAssetsRouteQueryKeys = ['source', 'category', 'keyword'] as const

export type ProfileAssetsRouteQueryKey = (typeof profileAssetsRouteQueryKeys)[number]

export type ProfileAssetsRouteQuery = Record<ProfileAssetsRouteQueryKey, string>

export const profileAssetDetailRouteQueryKeys = ['source', 'assetId', 'category'] as const

export type ProfileAssetDetailRouteQueryKey = (typeof profileAssetDetailRouteQueryKeys)[number]

export type ProfileAssetDetailRouteQuery = Record<ProfileAssetDetailRouteQueryKey, string>
