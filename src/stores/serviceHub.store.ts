import { defineStore } from 'pinia'
import type { HomeShellServiceEntryId, HomeShellServiceReminderState } from '../models/homeShellMenu.model'

interface ServiceHubState {
  reminders: Partial<Record<HomeShellServiceEntryId, HomeShellServiceReminderState>>
  hydrated: boolean
}

const cloneReminderState = (item: HomeShellServiceReminderState): HomeShellServiceReminderState => ({
  ...item,
})

export const useServiceHubStore = defineStore('service-hub', {
  state: (): ServiceHubState => ({
    reminders: {},
    hydrated: false,
  }),
  actions: {
    replaceReminders(items: HomeShellServiceReminderState[]) {
      const nextMap: Partial<Record<HomeShellServiceEntryId, HomeShellServiceReminderState>> = {}
      items.forEach((item) => {
        nextMap[item.serviceId] = cloneReminderState(item)
      })
      this.reminders = nextMap
      this.hydrated = true
    },
    consumeReminder(serviceId: HomeShellServiceEntryId) {
      const current = this.reminders[serviceId]
      if (!current) {
        return
      }

      this.reminders = {
        ...this.reminders,
        [serviceId]: {
          ...current,
          hasReminder: false,
          unreadCount: 0,
        },
      }
    },
  },
})
