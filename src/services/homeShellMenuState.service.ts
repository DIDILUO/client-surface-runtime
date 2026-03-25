import { computed } from 'vue'
import type {
  ContentSceneDto,
  ContentServiceHubEntriesBlockDto,
  ContentServiceHubEntryReminderDto,
} from '../contracts/content-api.contract'
import { createContentSceneSnapshot } from '../implementations/content.mock'
import type {
  HomeShellDrawerEntry,
  HomeShellIndicatorTone,
  HomeShellServiceEntryId,
  HomeShellServiceReminderState,
} from '../models/homeShellMenu.model'
import { useServiceHubStore } from '../stores/serviceHub.store'
import { resolveContentScene, runContentAction } from './content.service'
import { resolveHomeShellDrawerEntries, type HomeShellEntrySource } from './homeShellMenu.service'

let hydratePromise: Promise<HomeShellServiceReminderState[]> | null = null

const mapIndicatorTone = (tone: ContentServiceHubEntryReminderDto['indicatorTone']): HomeShellIndicatorTone => {
  return tone
}

const mapReminderItem = (item: ContentServiceHubEntryReminderDto): HomeShellServiceReminderState => ({
  serviceId: item.serviceId,
  hasReminder: item.hasReminder,
  unreadCount: item.unreadCount,
  indicatorTone: mapIndicatorTone(item.indicatorTone),
  latestMessageId: item.latestMessageId,
  latestMessageAt: item.latestMessageAt,
})

const extractReminderStates = (scene: ContentSceneDto | null): HomeShellServiceReminderState[] => {
  if (!scene) {
    return []
  }

  const reminderBlock = scene.blocks.find((item) => item.blockType === 'service_hub_entries') as ContentServiceHubEntriesBlockDto | undefined
  if (!reminderBlock) {
    return []
  }

  return reminderBlock.items.map(mapReminderItem)
}

const mergeDrawerEntriesWithReminder = (
  entries: HomeShellDrawerEntry[],
  reminders: Partial<Record<HomeShellServiceEntryId, HomeShellServiceReminderState>>,
): HomeShellDrawerEntry[] => {
  return entries.map((entry) => {
    if (entry.id === 'settings') {
      return {
        ...entry,
        badge: entry.badge ? { ...entry.badge } : undefined,
      }
    }

    const reminder = reminders[entry.id]
    return {
      ...entry,
      badge: entry.badge ? { ...entry.badge } : undefined,
      indicator: reminder?.hasReminder
        ? {
            visible: true,
            tone: reminder.indicatorTone,
          }
        : undefined,
    }
  })
}

export const createHomeShellMenuReminderShell = (): HomeShellServiceReminderState[] => {
  const scene = createContentSceneSnapshot('service_hub')
  return extractReminderStates(scene)
}

export const ensureHomeShellMenuReminderHydrated = async (): Promise<HomeShellServiceReminderState[]> => {
  const serviceHubStore = useServiceHubStore()
  if (serviceHubStore.hydrated) {
    return Object.values(serviceHubStore.reminders).filter((item): item is HomeShellServiceReminderState => Boolean(item))
  }

  if (!hydratePromise) {
    hydratePromise = resolveContentScene({ sceneId: 'service_hub' })
      .then((scene) => {
        const reminderStates = extractReminderStates(scene)
        serviceHubStore.replaceReminders(reminderStates)
        return reminderStates
      })
      .finally(() => {
        hydratePromise = null
      })
  }

  return hydratePromise
}

export const useResolvedHomeShellDrawerEntries = (source: HomeShellEntrySource = 'shell-drawer') => {
  const serviceHubStore = useServiceHubStore()
  if (!serviceHubStore.hydrated) {
    serviceHubStore.replaceReminders(createHomeShellMenuReminderShell())
  }

  return computed(() => {
    return mergeDrawerEntriesWithReminder(resolveHomeShellDrawerEntries(source), serviceHubStore.reminders)
  })
}

export const consumeHomeShellServiceReminder = async (serviceId: HomeShellServiceEntryId) => {
  const serviceHubStore = useServiceHubStore()
  if (!serviceHubStore.hydrated) {
    await ensureHomeShellMenuReminderHydrated()
  }

  const latestMessageId = serviceHubStore.reminders[serviceId]?.latestMessageId
  const result = await runContentAction({
    actionType: 'service-reminder-consume',
    serviceId,
    latestMessageId,
  })

  if ('serviceId' in result && result.serviceId === serviceId && result.hasReminder === false) {
    serviceHubStore.consumeReminder(serviceId)
    return true
  }

  return false
}
