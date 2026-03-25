/**
 * 文件版本：v0002
 * 更新时间：2026-03-23 15:26:30
 * Encoding: UTF-8
 * 本次更新：新增路由参数白名单提取能力，统一限制页面可读取的 query 字段
 */

export type RouteQueryPrimitive = string | number | boolean
export type RouteQueryRecord = Record<string, RouteQueryPrimitive | null | undefined>

export const stringifyRouteQuery = (query: RouteQueryRecord) => {
  return Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      return `${key}=${encodeURIComponent(String(value))}`
    })
    .join('&')
}

export const buildRouteUrl = (path: string, query?: RouteQueryRecord) => {
  if (!query) {
    return path
  }

  const queryString = stringifyRouteQuery(query)
  return queryString ? `${path}?${queryString}` : path
}

export const decodeRouteQueryValue = (value: unknown, fallback = '') => {
  if (typeof value !== 'string' || value.length === 0) {
    return fallback
  }

  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export const pickRouteQuery = <T extends string>(query: Record<string, unknown>, allowedKeys: readonly T[]) => {
  const normalized = {} as Record<T, string>

  allowedKeys.forEach((key) => {
    normalized[key] = decodeRouteQueryValue(query[key])
  })

  return normalized
}
