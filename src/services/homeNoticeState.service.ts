/**
 * 文件版本：v0002
 * 更新时间：2026-03-25 20:25:00
 * Encoding: UTF-8
 * 本次更新：首页公告状态改为复用统一 content 链，仅保留公告详情页兼容包装
 */

import type { ContentNoticeBarBlockDto } from '../contracts/content-api.contract'
import { contentNoticeDb } from '../mocks/content-db/notices'
import { contentNoticeUnreadSeed } from '../mocks/content-db/notices'
import type { HomeAnnouncementItem } from '../models/homeRailHome.model'
import { createContentSceneSnapshot } from '../implementations/content.mock'
import { resolveContentScene, runContentAction } from './content.service'

const resolveNoticeBarBlock = (block?: ContentNoticeBarBlockDto): HomeAnnouncementItem[] => {
  if (!block) {
    return []
  }

  return block.items.map((item) => ({
    noticeId: item.noticeId,
    title: item.title,
    type: item.type,
    time: item.time,
    isUnread: item.isUnread,
  }))
}

const extractHomeNoticeItems = (sceneBlocks: Array<{ blockType: string }>) => {
  const noticeBarBlock = sceneBlocks.find((item) => item.blockType === 'notice_bar') as ContentNoticeBarBlockDto | undefined
  return resolveNoticeBarBlock(noticeBarBlock)
}

export const createHomeAnnouncementItemsShell = (): HomeAnnouncementItem[] => {
  const scene = createContentSceneSnapshot('home')
  return scene ? extractHomeNoticeItems(scene.blocks) : []
}

export const resolveHomeAnnouncementItems = async (): Promise<HomeAnnouncementItem[]> => {
  const scene = await resolveContentScene({ sceneId: 'home' })
  return extractHomeNoticeItems(scene.blocks)
}

export const isContentNoticeId = (noticeId: string): boolean => {
  return contentNoticeDb.some((item) => item.noticeId === noticeId)
}

export const isHomeAnnouncementNoticeId = (noticeId: string): boolean => {
  return Object.prototype.hasOwnProperty.call(contentNoticeUnreadSeed, noticeId)
}

export const consumeHomeAnnouncementUnread = async (noticeId: string): Promise<boolean> => {
  if (!isHomeAnnouncementNoticeId(noticeId)) {
    return false
  }

  const result = await runContentAction({
    actionType: 'notice-read',
    noticeId,
  })

  return 'noticeId' in result && result.noticeId === noticeId && result.isUnread === false
}
