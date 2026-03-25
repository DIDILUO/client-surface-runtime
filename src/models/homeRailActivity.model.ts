import type { HomeContentTargetRef } from './homeRailHome.model'

export type ActivityEntryTone = 'dark' | 'light' | 'soft'
export type ActivityNoticeType = '系统更新' | '活动预告' | '维护通知' | '安全警报' | '社区动态'

export interface ActivityEntry {
  id: string
  title: string
  eyebrow: string
  description: string
  tone: ActivityEntryTone
  badgeText?: string
  target: HomeContentTargetRef
}

export interface ActivityNotice {
  id: string
  title: string
  type: ActivityNoticeType
  time: string
}

export interface HomeRailActivityContent {
  entries: ActivityEntry[]
  notices: {
    tags: string[]
    list: ActivityNotice[]
  }
}
