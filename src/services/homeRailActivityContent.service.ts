import type {
  ContentActivityEntriesBlockDto,
  ContentActivityNoticeFeedBlockDto,
  ContentSceneDto,
} from '../contracts/content-api.contract'
import { createContentSceneSnapshot } from '../implementations/content.mock'
import type { ActivityEntry, ActivityNotice, HomeRailActivityContent } from '../models/homeRailActivity.model'
import type { HomeContentTargetRef } from '../models/homeRailHome.model'
import { resolveContentScene } from './content.service'

const activityShell: HomeRailActivityContent = {
  entries: [],
  notices: {
    tags: ['全部'],
    list: [],
  },
}

const cloneActivityShell = (): HomeRailActivityContent => ({
  entries: activityShell.entries.map((entry) => ({ ...entry, target: { ...entry.target } })),
  notices: {
    tags: [...activityShell.notices.tags],
    list: activityShell.notices.list.map((notice) => ({ ...notice })),
  },
})

const toHomeTarget = (target: { targetType: string; targetId: string }): HomeContentTargetRef => ({
  targetType: target.targetType as HomeContentTargetRef['targetType'],
  targetId: target.targetId,
})

const mapActivityEntries = (block?: ContentActivityEntriesBlockDto): ActivityEntry[] => {
  if (!block) {
    return []
  }

  return block.items.map<ActivityEntry>((item) => ({
    id: item.entryId,
    title: item.title,
    eyebrow: item.eyebrow,
    description: item.description,
    tone: item.tone,
    badgeText: item.badgeLabel,
    target: toHomeTarget(item.target),
  }))
}

const mapActivityNotices = (block?: ContentActivityNoticeFeedBlockDto): HomeRailActivityContent['notices'] => {
  if (!block) {
    return {
      tags: [...activityShell.notices.tags],
      list: [...activityShell.notices.list],
    }
  }

  return {
    tags: [...block.tags],
    list: block.items.map<ActivityNotice>((item) => ({
      id: item.noticeId,
      title: item.title,
      type: item.type as ActivityNotice['type'],
      time: item.time,
    })),
  }
}

const adaptActivitySceneToContent = (scene: ContentSceneDto): HomeRailActivityContent => {
  const entriesBlock = scene.blocks.find((item) => item.blockType === 'activity_entries') as ContentActivityEntriesBlockDto | undefined
  const noticesBlock = scene.blocks.find((item) => item.blockType === 'activity_notice_feed') as ContentActivityNoticeFeedBlockDto | undefined

  return {
    entries: mapActivityEntries(entriesBlock),
    notices: mapActivityNotices(noticesBlock),
  }
}

export const createHomeRailActivityContentShell = (): HomeRailActivityContent => {
  const scene = createContentSceneSnapshot('activity')
  return scene ? adaptActivitySceneToContent(scene) : cloneActivityShell()
}

export const resolveHomeRailActivityContent = async (): Promise<HomeRailActivityContent> => {
  const scene = await resolveContentScene({ sceneId: 'activity' })
  return adaptActivitySceneToContent(scene)
}
