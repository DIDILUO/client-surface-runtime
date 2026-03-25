import type { ContentServiceEntryTone, ContentTargetDto } from '../contracts/content-api.contract'

export type ActionEntryResourceType = 'market_action' | 'service_action' | 'settings_action'

export interface ActionEntryMetric {
  id: string
  label: string
  value: string
  caption?: string
}

export interface ActionEntrySectionItem {
  id: string
  title: string
  description: string
  value?: string
  target?: ContentTargetDto
}

export interface ActionEntrySection {
  id: string
  title: string
  englishTitle: string
  items: ActionEntrySectionItem[]
}

export interface ActionEntryContent {
  resourceType: ActionEntryResourceType
  id: string
  parentId: string
  title: string
  englishTitle: string
  status: string
  statusLabel: string
  tone: ContentServiceEntryTone
  summary: string
  badges: string[]
  metrics: ActionEntryMetric[]
  sections: ActionEntrySection[]
}
