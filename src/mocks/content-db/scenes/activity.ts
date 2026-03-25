import type { ContentActivityEntryTone, ContentTargetDto } from '../../../contracts/content-api.contract'

export interface ActivitySceneEntryRecord {
  entryId: string
  title: string
  eyebrow: string
  description: string
  tone: ContentActivityEntryTone
  badgeLabel?: string
  target: ContentTargetDto
}

export interface ActivitySceneDb {
  sceneId: 'activity'
  version: number
  updatedAt: string
  entries: ActivitySceneEntryRecord[]
  notices: {
    tags: string[]
    noticeIds: string[]
  }
}

export const activitySceneDb: ActivitySceneDb = {
  sceneId: 'activity',
  version: 1,
  updatedAt: '2026-03-25T16:36:00+08:00',
  entries: [
    {
      entryId: 'asset-merge',
      title: '资产合成',
      eyebrow: 'MERGE',
      description: '核心素材融合通道已开放。',
      tone: 'dark',
      badgeLabel: 'NEW',
      target: {
        targetType: 'activity',
        targetId: 'asset-merge',
      },
    },
    {
      entryId: 'priority-draw',
      title: '抽奖活动',
      eyebrow: 'DRAW',
      description: '优先参与资格正在同步。',
      tone: 'light',
      badgeLabel: 'NEW',
      target: {
        targetType: 'activity',
        targetId: 'priority-draw',
      },
    },
    {
      entryId: 'network-invite',
      title: '建立网络节点',
      eyebrow: 'INVITE',
      description: '邀请链路和奖励进度已预留。',
      tone: 'soft',
      target: {
        targetType: 'activity',
        targetId: 'network-invite',
      },
    },
  ],
  notices: {
    tags: ['全部', '系统更新', '活动预告', '维护通知', '安全警报', '社区动态'],
    noticeIds: ['N-01', 'N-02', 'N-03', 'N-04', 'N-05'],
  },
}
