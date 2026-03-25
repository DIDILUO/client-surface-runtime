import type {
  ContentResourceDto,
  ContentServiceEntryId,
  ContentServiceEntryPayloadDto,
} from '../contracts/content-api.contract'
import { createContentResourceSnapshot } from '../implementations/content.mock'
import type { ServiceEntryContent } from '../models/serviceEntry.model'
import { resolveContentResource } from './content.service'

const DEFAULT_SERVICE_ID: ContentServiceEntryId = 'orders'

const cloneServiceEntryContent = (content: ServiceEntryContent): ServiceEntryContent => ({
  ...content,
  badges: [...content.badges],
  metrics: content.metrics.map((item) => ({ ...item })),
  sections: content.sections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      target: item.target ? { ...item.target } : undefined,
    })),
  })),
})

const defaultContent: ServiceEntryContent = {
  id: DEFAULT_SERVICE_ID,
  title: '我的订单',
  englishTitle: 'Order Center',
  status: 'LIVE',
  statusLabel: 'SYNCING_ORDERS',
  tone: 'cyan',
  summary: '',
  badges: [],
  metrics: [],
  sections: [],
}

const normalizeServiceId = (serviceId: string): ContentServiceEntryId => {
  const accepted: ContentServiceEntryId[] = ['orders', 'auth', 'wallet', 'invite', 'community']
  return accepted.includes(serviceId as ContentServiceEntryId) ? (serviceId as ContentServiceEntryId) : DEFAULT_SERVICE_ID
}

const adaptResourceToContent = (resource: ContentResourceDto): ServiceEntryContent => {
  const payload = resource.payload as ContentServiceEntryPayloadDto

  return {
    id: payload.serviceId,
    title: resource.title,
    englishTitle: payload.englishTitle,
    status: resource.status,
    statusLabel: payload.statusLabel,
    tone: payload.tone,
    summary: resource.summary ?? '',
    badges: [...payload.badges],
    metrics: payload.metrics.map((item) => ({
      id: item.metricId,
      label: item.label,
      value: item.value,
      caption: item.caption,
    })),
    sections: payload.sections.map((section) => ({
      id: section.sectionId,
      title: section.title,
      englishTitle: section.englishTitle,
      items: section.items.map((item) => ({
        id: item.itemId,
        title: item.title,
        description: item.description,
        value: item.value,
        target: item.target ? { ...item.target } : undefined,
      })),
    })),
  }
}

export const createServiceEntryContentShell = (serviceId: string): ServiceEntryContent => {
  const resolvedServiceId = normalizeServiceId(serviceId)
  const snapshot = createContentResourceSnapshot('service_entry', resolvedServiceId)
  return snapshot ? adaptResourceToContent(snapshot) : cloneServiceEntryContent(defaultContent)
}

export const resolveServiceEntryContent = async (serviceId: string): Promise<ServiceEntryContent> => {
  const resolvedServiceId = normalizeServiceId(serviceId)
  const resource = await resolveContentResource({
    resourceType: 'service_entry',
    resourceId: resolvedServiceId,
  })

  return adaptResourceToContent(resource)
}
