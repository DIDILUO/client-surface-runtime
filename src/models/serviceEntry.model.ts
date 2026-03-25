import type { ContentServiceEntryId, ContentServiceEntryTone, ContentTargetDto } from '../contracts/content-api.contract'

export interface ServiceEntryMetric {
  id: string
  label: string
  value: string
  caption?: string
}

export interface ServiceEntrySectionItem {
  id: string
  title: string
  description: string
  value?: string
  target?: ContentTargetDto
}

export interface ServiceEntrySection {
  id: string
  title: string
  englishTitle: string
  items: ServiceEntrySectionItem[]
}

export interface ServiceEntryContent {
  id: ContentServiceEntryId
  title: string
  englishTitle: string
  status: string
  statusLabel: string
  tone: ContentServiceEntryTone
  summary: string
  badges: string[]
  metrics: ServiceEntryMetric[]
  sections: ServiceEntrySection[]
}
