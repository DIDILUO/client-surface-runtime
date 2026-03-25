import type { ContentActionEntryPayloadDto, ContentResourceDto } from '../contracts/content-api.contract'
import type { ActionEntryContent, ActionEntryResourceType } from '../models/actionEntry.model'
import { createContentResourceSnapshot } from '../implementations/content.mock'
import { resolveContentResource } from './content.service'

const defaultShell: ActionEntryContent = {
  resourceType: 'market_action',
  id: '',
  parentId: '',
  title: '动作详情',
  englishTitle: 'Action Detail',
  status: 'LIVE',
  statusLabel: 'ACTION_READY',
  tone: 'slate',
  summary: '',
  badges: [],
  metrics: [],
  sections: [],
}

const cloneActionEntryContent = (content: ActionEntryContent): ActionEntryContent => ({
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

const normalizeResourceType = (resourceType: string): ActionEntryResourceType => {
  if (resourceType === 'settings_action') {
    return 'settings_action'
  }

  if (resourceType === 'service_action') {
    return 'service_action'
  }

  return 'market_action'
}

const adaptResourceToContent = (resource: ContentResourceDto): ActionEntryContent => {
  const payload = resource.payload as ContentActionEntryPayloadDto

  return {
    resourceType: resource.resourceType as ActionEntryResourceType,
    id: payload.actionId,
    parentId: payload.parentId,
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

export const createActionEntryShell = (resourceType: string, actionId: string): ActionEntryContent => {
  const resolvedType = normalizeResourceType(resourceType)
  const snapshot = createContentResourceSnapshot(resolvedType, actionId)
  return snapshot ? adaptResourceToContent(snapshot) : cloneActionEntryContent({ ...defaultShell, resourceType: resolvedType, id: actionId })
}

export const resolveActionEntryContent = async (
  resourceType: string,
  actionId: string,
): Promise<ActionEntryContent> => {
  const resource = await resolveContentResource({
    resourceType: normalizeResourceType(resourceType),
    resourceId: actionId,
  })

  return adaptResourceToContent(resource)
}
