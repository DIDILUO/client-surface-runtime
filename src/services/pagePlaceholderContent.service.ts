/**
 * 文件版本：v0002
 * 更新时间：2026-03-23 16:40:30
 * Encoding: UTF-8
 * 本次更新：占位内容服务改由 port + adapter 驱动，service 只保留编排逻辑
 */

import { pageContentMockAdapter } from '../adapters/pageContent.mock.adapter'
import type { NoticeBlock, NoticeContentPreset, UpdatingContentPreset } from '../ports/pageContent.port'

export type { NoticeBlock, NoticeContentPreset, UpdatingContentPreset }

const pickUpdatingPreset = (moduleId: string): UpdatingContentPreset => {
  return pageContentMockAdapter.getUpdatingPreset(moduleId) ?? pageContentMockAdapter.getDefaultUpdatingPreset()
}

const pickNoticePreset = (noticeId: string): NoticeContentPreset => {
  return pageContentMockAdapter.getNoticePreset(noticeId) ?? pageContentMockAdapter.getDefaultNoticePreset()
}

export const resolveUpdatingContent = (moduleId: string, source: string): UpdatingContentPreset => {
  const preset = pickUpdatingPreset(moduleId)
  const normalizedSource = source.trim().toUpperCase()

  return {
    description: preset.description,
    reserveHint: preset.reserveHint,
    badges: normalizedSource
      ? [normalizedSource, ...preset.badges.slice(1)]
      : [...preset.badges],
  }
}

export const resolveNoticeContent = (noticeId: string, source: string): NoticeContentPreset => {
  const preset = pickNoticePreset(noticeId)
  const normalizedSource = source.trim().toUpperCase()
  const badges = normalizedSource
    ? [normalizedSource, ...preset.badges.slice(1)]
    : [...preset.badges]

  return {
    summary: preset.summary,
    badges,
    blocks: preset.blocks.map((block) => {
      if (block.kind === 'paragraph') {
        return { ...block }
      }

      return {
        ...block,
        items: [...block.items],
      }
    }),
  }
}
