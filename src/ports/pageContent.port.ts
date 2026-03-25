/**
 * 文件版本：v0001
 * 更新时间：2026-03-23 16:35:00
 * Encoding: UTF-8
 * 本次更新：新增页面内容端口定义，统一占位内容服务的输入输出契约
 */

export interface NoticeParagraphBlock {
  id: string
  kind: 'paragraph'
  text: string
}

export interface NoticeListBlock {
  id: string
  kind: 'list'
  title: string
  items: string[]
}

export type NoticeBlock = NoticeParagraphBlock | NoticeListBlock

export interface NoticeContentPreset {
  summary: string
  badges: string[]
  blocks: NoticeBlock[]
}

export interface UpdatingContentPreset {
  description: string
  reserveHint: string
  badges: string[]
}

export interface PageContentPort {
  getDefaultUpdatingPreset: () => UpdatingContentPreset
  getUpdatingPreset: (moduleId: string) => UpdatingContentPreset | undefined
  getDefaultNoticePreset: () => NoticeContentPreset
  getNoticePreset: (noticeId: string) => NoticeContentPreset | undefined
}
