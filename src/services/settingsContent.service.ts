import type {
  ContentSceneDto,
  ContentSettingsSectionsBlockDto,
  ContentSettingsSummaryBlockDto,
  ContentTargetDto,
} from '../contracts/content-api.contract'
import { createContentSceneSnapshot } from '../implementations/content.mock'
import type { SettingSection, SettingsContent, SettingsSummary } from '../models/settings.model'
import { resolveContentScene } from './content.service'

const settingsShell: SettingsContent = {
  summary: {
    title: '关于天异',
    englishTitle: 'About Aether',
    description: '',
    actionLabel: '问题反馈',
    actionEnglishLabel: 'Feedback',
    actionTarget: {
      targetType: 'settings_action',
      targetId: 'feedback',
    },
  },
  sections: [],
}

const cloneSettingsShell = (): SettingsContent => ({
  summary: {
    ...settingsShell.summary,
    actionTarget: settingsShell.summary.actionTarget ? { ...settingsShell.summary.actionTarget } : undefined,
  },
  sections: settingsShell.sections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      target: item.target ? { ...item.target } : undefined,
    })),
  })),
})

const cloneTarget = (target?: ContentTargetDto) => (target ? { ...target } : undefined)

const moveMatchedSectionToFront = (sections: SettingSection[], sectionId: string) => {
  if (!sectionId) {
    return sections
  }

  const targetIndex = sections.findIndex((section) => section.id === sectionId)
  if (targetIndex <= 0) {
    return sections
  }

  const target = sections[targetIndex]
  return [target, ...sections.filter((_, index) => index !== targetIndex)]
}

const mapSummary = (block?: ContentSettingsSummaryBlockDto): SettingsSummary => {
  if (!block) {
    return {
      ...settingsShell.summary,
      actionTarget: cloneTarget(settingsShell.summary.actionTarget),
    }
  }

  return {
    title: block.title,
    englishTitle: block.englishTitle,
    description: block.description,
    actionLabel: block.actionLabel,
    actionEnglishLabel: block.actionEnglishLabel,
    actionTarget: cloneTarget(block.actionTarget),
  }
}

const mapSections = (block?: ContentSettingsSectionsBlockDto): SettingSection[] => {
  if (!block) {
    return []
  }

  return block.sections.map((section) => ({
    id: section.sectionId,
    title: section.title,
    englishTitle: section.englishTitle,
    items: section.items.map((item) => ({
      id: item.itemId,
      title: item.title,
      value: item.value,
      target: cloneTarget(item.target),
    })),
  }))
}

const adaptSettingsSceneToContent = (scene: ContentSceneDto, source: string, sectionId: string): SettingsContent => {
  const summaryBlock = scene.blocks.find((item) => item.blockType === 'settings_summary') as ContentSettingsSummaryBlockDto | undefined
  const sectionsBlock = scene.blocks.find((item) => item.blockType === 'settings_sections') as ContentSettingsSectionsBlockDto | undefined

  const summary = mapSummary(summaryBlock)
  let sections = mapSections(sectionsBlock)

  if (sectionId) {
    summary.actionLabel = `快速定位：${sectionId}`
    sections = moveMatchedSectionToFront(sections, sectionId)
  }

  return {
    summary,
    sections,
  }
}

export const createSettingsContentShell = (source = '', sectionId = ''): SettingsContent => {
  const scene = createContentSceneSnapshot('settings')
  return scene ? adaptSettingsSceneToContent(scene, source, sectionId) : cloneSettingsShell()
}

export const resolveSettingsContent = async (source: string, sectionId: string): Promise<SettingsContent> => {
  const scene = await resolveContentScene({ sceneId: 'settings' })
  return adaptSettingsSceneToContent(scene, source, sectionId)
}
