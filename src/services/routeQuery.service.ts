/**
 * 文件版本：v0002
 * 更新时间：2026-03-23 13:59:30
 * Encoding: UTF-8
 * 本次更新：路由参数服务改为 schema 驱动，统一长度裁剪与字符白名单校验
 */

import {
  actionEntryRouteQueryKeys,
  contentResourceRouteQueryKeys,
  noticeDetailRouteQueryKeys,
  profileAddressRouteQueryKeys,
  profileAssetDetailRouteQueryKeys,
  profileAssetsRouteQueryKeys,
  serviceEntryRouteQueryKeys,
  settingsRouteQueryKeys,
  updatingRouteQueryKeys,
  type ActionEntryRouteQuery,
  type ContentResourceRouteQuery,
  type NoticeDetailRouteQuery,
  type ProfileAddressRouteQuery,
  type ProfileAssetDetailRouteQuery,
  type ProfileAssetsRouteQuery,
  type ServiceEntryRouteQuery,
  type SettingsRouteQuery,
  type UpdatingRouteQuery,
} from '../models/routeQuery.model'
import { routeQuerySchema } from '../models/routeQuery.schema'
import { pickRouteQuery } from '../utils/routeQuery.util'

type RawRouteQuery = Record<string, unknown>

export const parseUpdatingRouteQuery = (query: RawRouteQuery): UpdatingRouteQuery => {
  const picked = pickRouteQuery(query, updatingRouteQueryKeys)
  return routeQuerySchema.sanitizeUpdating(picked)
}

export const parseNoticeDetailRouteQuery = (query: RawRouteQuery): NoticeDetailRouteQuery => {
  const picked = pickRouteQuery(query, noticeDetailRouteQueryKeys)
  return routeQuerySchema.sanitizeNoticeDetail(picked)
}

export const parseSettingsRouteQuery = (query: RawRouteQuery): SettingsRouteQuery => {
  const picked = pickRouteQuery(query, settingsRouteQueryKeys)
  return routeQuerySchema.sanitizeSettings(picked)
}

export const parseServiceEntryRouteQuery = (query: RawRouteQuery): ServiceEntryRouteQuery => {
  const picked = pickRouteQuery(query, serviceEntryRouteQueryKeys)
  return routeQuerySchema.sanitizeServiceEntry(picked)
}

export const parseActionEntryRouteQuery = (query: RawRouteQuery): ActionEntryRouteQuery => {
  const picked = pickRouteQuery(query, actionEntryRouteQueryKeys)
  return routeQuerySchema.sanitizeActionEntry(picked)
}

export const parseContentResourceRouteQuery = (query: RawRouteQuery): ContentResourceRouteQuery => {
  const picked = pickRouteQuery(query, contentResourceRouteQueryKeys)
  return routeQuerySchema.sanitizeContentResource(picked)
}

export const parseProfileAddressRouteQuery = (query: RawRouteQuery): ProfileAddressRouteQuery => {
  const picked = pickRouteQuery(query, profileAddressRouteQueryKeys)
  return routeQuerySchema.sanitizeProfileAddress(picked)
}

export const parseProfileAssetsRouteQuery = (query: RawRouteQuery): ProfileAssetsRouteQuery => {
  const picked = pickRouteQuery(query, profileAssetsRouteQueryKeys)
  return routeQuerySchema.sanitizeProfileAssets(picked)
}

export const parseProfileAssetDetailRouteQuery = (query: RawRouteQuery): ProfileAssetDetailRouteQuery => {
  const picked = pickRouteQuery(query, profileAssetDetailRouteQueryKeys)
  return routeQuerySchema.sanitizeProfileAssetDetail(picked)
}
