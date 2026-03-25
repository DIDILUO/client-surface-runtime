/**
 * 文件版本：v0001
 * 更新时间：2026-03-23 13:58:20
 * Encoding: UTF-8
 * 本次更新：新增路由参数 schema 级约束，统一字段长度与字符白名单校验
 */

import type {
  ActionEntryRouteQuery,
  ActionEntryRouteQueryKey,
  ContentResourceRouteQuery,
  ContentResourceRouteQueryKey,
  NoticeDetailRouteQuery,
  NoticeDetailRouteQueryKey,
  ProfileAddressRouteQuery,
  ProfileAddressRouteQueryKey,
  ProfileAssetDetailRouteQuery,
  ProfileAssetDetailRouteQueryKey,
  ProfileAssetsRouteQuery,
  ProfileAssetsRouteQueryKey,
  ServiceEntryRouteQuery,
  ServiceEntryRouteQueryKey,
  SettingsRouteQuery,
  SettingsRouteQueryKey,
  UpdatingRouteQuery,
  UpdatingRouteQueryKey,
} from './routeQuery.model'

const clean = (value: string) => value.trim()

const pickByPattern = (value: string, pattern: RegExp, maxLength: number) => {
  const normalized = clean(value).slice(0, maxLength)
  return pattern.test(normalized) ? normalized : ''
}

const pickText = (value: string, maxLength: number) => {
  return clean(value).slice(0, maxLength)
}

const normalizeEnumText = (value: string, fallback: string, maxLength: number) => {
  const normalized = clean(value).slice(0, maxLength)
  return normalized || fallback
}

const idPattern = /^[A-Za-z0-9:_./-]{1,64}$/
const sourcePattern = /^[A-Za-z0-9:_./-]{1,40}$/
const typePattern = /^[A-Za-z0-9_-]{1,20}$/
const statusPattern = /^[A-Za-z0-9 _-]{1,20}$/
const timePattern = /^[0-9:\- /]{1,20}$/

const sanitizeUpdating = (query: Record<UpdatingRouteQueryKey, string>): UpdatingRouteQuery => {
  return {
    moduleId: pickByPattern(query.moduleId, idPattern, 64),
    title: pickText(query.title, 40),
    englishTitle: pickText(query.englishTitle, 48),
    statusLabel: normalizeEnumText(query.statusLabel, 'Construction', 20),
    source: pickByPattern(query.source, sourcePattern, 40),
  }
}

const sanitizeNoticeDetail = (query: Record<NoticeDetailRouteQueryKey, string>): NoticeDetailRouteQuery => {
  return {
    noticeId: pickByPattern(query.noticeId, idPattern, 64),
    type: pickByPattern(query.type, typePattern, 20),
    status: normalizeEnumText(pickByPattern(query.status, statusPattern, 20), 'NEW', 20),
    time: pickByPattern(query.time, timePattern, 20),
    title: pickText(query.title, 80),
    source: pickByPattern(query.source, sourcePattern, 40),
  }
}

const sanitizeSettings = (query: Record<SettingsRouteQueryKey, string>): SettingsRouteQuery => {
  return {
    source: pickByPattern(query.source, sourcePattern, 40),
    section: pickByPattern(query.section, sourcePattern, 40),
  }
}

const sanitizeServiceEntry = (query: Record<ServiceEntryRouteQueryKey, string>): ServiceEntryRouteQuery => {
  return {
    serviceId: pickByPattern(query.serviceId, sourcePattern, 40),
    source: pickByPattern(query.source, sourcePattern, 40),
  }
}

const sanitizeActionEntry = (query: Record<ActionEntryRouteQueryKey, string>): ActionEntryRouteQuery => {
  return {
    resourceType: pickByPattern(query.resourceType, sourcePattern, 40),
    actionId: pickByPattern(query.actionId, idPattern, 64),
    source: pickByPattern(query.source, sourcePattern, 40),
  }
}

const sanitizeContentResource = (
  query: Record<ContentResourceRouteQueryKey, string>,
): ContentResourceRouteQuery => {
  return {
    resourceType: pickByPattern(query.resourceType, sourcePattern, 40),
    resourceId: pickByPattern(query.resourceId, idPattern, 64),
    source: pickByPattern(query.source, sourcePattern, 40),
  }
}

const sanitizeProfileAddress = (query: Record<ProfileAddressRouteQueryKey, string>): ProfileAddressRouteQuery => {
  return {
    source: pickByPattern(query.source, sourcePattern, 40),
  }
}

const sanitizeProfileAssets = (query: Record<ProfileAssetsRouteQueryKey, string>): ProfileAssetsRouteQuery => {
  return {
    source: pickByPattern(query.source, sourcePattern, 40),
    category: pickByPattern(query.category, sourcePattern, 40),
    keyword: pickText(query.keyword, 40),
  }
}

const sanitizeProfileAssetDetail = (
  query: Record<ProfileAssetDetailRouteQueryKey, string>,
): ProfileAssetDetailRouteQuery => {
  return {
    source: pickByPattern(query.source, sourcePattern, 40),
    assetId: pickByPattern(query.assetId, idPattern, 64),
    category: pickByPattern(query.category, sourcePattern, 40),
  }
}

export const routeQuerySchema = {
  sanitizeUpdating,
  sanitizeNoticeDetail,
  sanitizeSettings,
  sanitizeServiceEntry,
  sanitizeActionEntry,
  sanitizeContentResource,
  sanitizeProfileAddress,
  sanitizeProfileAssets,
  sanitizeProfileAssetDetail,
}
