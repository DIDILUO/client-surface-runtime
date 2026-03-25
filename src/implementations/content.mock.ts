import type {
  ContentActionRequestDto,
  ContentActionEntryPayloadDto,
  ContentActionResultDto,
  ContentActivityEntriesBlockDto,
  ContentActivityNoticeFeedBlockDto,
  ContentActivityPayloadDto,
  ContentEnvelope,
  ContentHomeBannerPayloadDto,
  ContentListDto,
  ContentListItemDto,
  ContentNoticeBlockDto,
  ContentNoticePayloadDto,
  ContentListRequestDto,
  ContentMarketItemSummaryDto,
  ContentResourceDto,
  ContentResourceRequestDto,
  ContentProfileAssetsBlockDto,
  ContentProfileSummaryBlockDto,
  ContentSceneBlockDto,
  ContentSceneDto,
  ContentSceneRequestDto,
  ContentServiceEntryPayloadDto,
  ContentServiceHubEntriesBlockDto,
  ContentSettingsSectionsBlockDto,
  ContentSettingsSummaryBlockDto,
} from '../contracts/content-api.contract'
import type { ContentPort } from '../ports/content.port'
import { cloneContentAsset } from '../mocks/content-db/assets'
import { contentCategoryDb } from '../mocks/content-db/categories'
import { contentDropDb } from '../mocks/content-db/drops'
import { contentMarketItemDb } from '../mocks/content-db/market-items'
import { contentNoticeDb, contentNoticeUnreadSeed } from '../mocks/content-db/notices'
import { cloneContentServiceEntry, contentServiceEntryDb } from '../mocks/content-db/service-entries'
import { contentServiceHubReminderSeed } from '../mocks/content-db/service-hub'
import { activitySceneDb } from '../mocks/content-db/scenes/activity'
import { homeMarketActionDb, homeSceneDb } from '../mocks/content-db/scenes/home'
import { profileSceneDb } from '../mocks/content-db/scenes/profile'
import { settingsSceneDb } from '../mocks/content-db/scenes/settings'

const createRequestId = (prefix: string) => `${prefix}_${Date.now()}`
const createServerTime = () => new Date().toISOString()

const createEnvelope = <T>(data: T, requestIdPrefix: string): ContentEnvelope<T> => ({
  code: 0,
  message: 'ok',
  requestId: createRequestId(requestIdPrefix),
  serverTime: createServerTime(),
  data,
})

let noticeUnreadState: Record<string, boolean> = {
  ...contentNoticeUnreadSeed,
}

let serviceHubReminderState = {
  ...contentServiceHubReminderSeed,
}

const cloneNoticeBlocks = (blocks: ContentNoticeBlockDto[]): ContentNoticeBlockDto[] => {
  return blocks.map((block) => {
    if (block.kind === 'paragraph') {
      return { ...block }
    }

    return {
      ...block,
      items: [...block.items],
    }
  })
}

const buildHomeSceneBlocks = (): ContentSceneBlockDto[] => {
  const noticeBarBlock: ContentSceneBlockDto = {
    blockType: 'notice_bar',
    label: homeSceneDb.noticeBar.label,
    detailLabel: homeSceneDb.noticeBar.detailLabel,
    items: homeSceneDb.noticeBar.noticeIds
      .map((noticeId) => contentNoticeDb.find((item) => item.noticeId === noticeId))
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .map((item) => ({
        noticeId: item.noticeId,
        title: item.title,
        type: item.type,
        time: item.time,
        isUnread: noticeUnreadState[item.noticeId] ?? false,
        target: {
          targetType: 'notice',
          targetId: item.noticeId,
        },
      })),
  }

  const bannerBlock: ContentSceneBlockDto = {
    blockType: 'banner_carousel',
    items: homeSceneDb.banners
      .map((item) => {
        const asset = cloneContentAsset(item.assetId)
        if (!asset) {
          return null
        }

        return {
          bannerId: item.bannerId,
          title: item.title,
          liveLabel: item.liveLabel,
          tone: item.tone,
          asset,
          target: { ...item.target },
        }
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item)),
  }

  const featuredRecord = contentDropDb.find((item) => item.dropId === homeSceneDb.featured.dropId)
  const featuredBlock: ContentSceneBlockDto = {
    blockType: 'featured_drop',
    item: featuredRecord
      ? {
          dropId: featuredRecord.dropId,
          title: featuredRecord.title,
          sectionTitle: featuredRecord.sectionTitle,
          sectionSubtitle: featuredRecord.sectionSubtitle,
          priceLabel: featuredRecord.priceLabel,
          currency: featuredRecord.currency,
          priceInCent: featuredRecord.priceInCent,
          mintedCount: featuredRecord.mintedCount,
          supplyCount: featuredRecord.supplyCount,
          asset: cloneContentAsset(featuredRecord.assetId),
          placeholderIconKey: featuredRecord.placeholderIconKey,
          target: {
            targetType: 'drop',
            targetId: featuredRecord.dropId,
          },
        }
      : {
          dropId: '',
          title: '',
          sectionTitle: '',
          sectionSubtitle: '',
          priceLabel: '',
          currency: 'CNY',
          priceInCent: 0,
          mintedCount: 0,
          supplyCount: 0,
          asset: null,
          target: {
            targetType: 'drop',
            targetId: '',
          },
        },
  }

  const marketBlock: ContentSceneBlockDto = {
    blockType: 'market_overview',
    sectionTitle: homeSceneDb.market.sectionTitle,
    sectionSubtitle: homeSceneDb.market.sectionSubtitle,
    categories: homeSceneDb.market.categoryIds
      .map((categoryId) => contentCategoryDb.find((item) => item.categoryId === categoryId))
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .map((item) => ({
        categoryId: item.categoryId,
        categoryName: item.categoryName,
      })),
    actions: homeSceneDb.market.actionIds.map((actionId) => ({
      actionId,
      label: homeMarketActionDb[actionId].label,
      target: { ...homeMarketActionDb[actionId].target },
    })),
    items: homeSceneDb.market.itemIds
      .map((itemId) => contentMarketItemDb.find((item) => item.itemId === itemId))
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .map<ContentMarketItemSummaryDto>((item) => ({
        itemId: item.itemId,
        title: item.title,
        currency: item.currency,
        priceInCent: item.priceInCent,
        categoryIds: [...item.categoryIds],
        asset: cloneContentAsset(item.assetId),
        placeholderIconKey: item.placeholderIconKey,
        visualTone: item.visualTone,
        badgeType: item.badgeType,
        badgeLabel: item.badgeLabel,
        target: {
          targetType: 'market_item',
          targetId: item.itemId,
        },
      })),
  }

  return [noticeBarBlock, bannerBlock, featuredBlock, marketBlock]
}

const buildActivitySceneBlocks = (): ContentSceneBlockDto[] => {
  const entriesBlock: ContentActivityEntriesBlockDto = {
    blockType: 'activity_entries',
    items: activitySceneDb.entries.map((item) => ({
      entryId: item.entryId,
      title: item.title,
      eyebrow: item.eyebrow,
      description: item.description,
      tone: item.tone,
      badgeLabel: item.badgeLabel,
      target: { ...item.target },
    })),
  }

  const noticesBlock: ContentActivityNoticeFeedBlockDto = {
    blockType: 'activity_notice_feed',
    tags: [...activitySceneDb.notices.tags],
    items: activitySceneDb.notices.noticeIds
      .map((noticeId) => contentNoticeDb.find((item) => item.noticeId === noticeId))
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .map((item) => ({
        noticeId: item.noticeId,
        title: item.title,
        type: item.type,
        time: item.time,
        isUnread: noticeUnreadState[item.noticeId] ?? false,
        target: {
          targetType: 'notice',
          targetId: item.noticeId,
        },
      })),
  }

  return [entriesBlock, noticesBlock]
}

const buildProfileSceneBlocks = (): ContentSceneBlockDto[] => {
  const summaryBlock: ContentProfileSummaryBlockDto = {
    blockType: 'profile_summary',
    displayName: profileSceneDb.summary.displayName,
    address: profileSceneDb.summary.address,
    currency: profileSceneDb.summary.currency,
    totalValueInCent: profileSceneDb.summary.totalValueInCent,
    holdingsCount: profileSceneDb.summary.holdingsCount,
  }

  const assetsBlock: ContentProfileAssetsBlockDto = {
    blockType: 'profile_assets',
    categories: profileSceneDb.assets.categories.map((item) => ({ ...item })),
    subCategories: [...profileSceneDb.assets.subCategories],
    items: profileSceneDb.assets.items.map((item) => ({ ...item })),
  }

  return [summaryBlock, assetsBlock]
}

const buildSettingsSceneBlocks = (): ContentSceneBlockDto[] => {
  const summaryBlock: ContentSettingsSummaryBlockDto = {
    blockType: 'settings_summary',
    title: settingsSceneDb.summary.title,
    englishTitle: settingsSceneDb.summary.englishTitle,
    description: settingsSceneDb.summary.description,
    actionLabel: settingsSceneDb.summary.actionLabel,
    actionEnglishLabel: settingsSceneDb.summary.actionEnglishLabel,
    actionTarget: { ...settingsSceneDb.summary.actionTarget },
  }

  const sectionsBlock: ContentSettingsSectionsBlockDto = {
    blockType: 'settings_sections',
    sections: settingsSceneDb.sections.map((section) => ({
      sectionId: section.sectionId,
      title: section.title,
      englishTitle: section.englishTitle,
      items: section.items.map((item) => ({
        itemId: item.itemId,
        title: item.title,
        value: item.value,
        target: { ...item.target },
      })),
    })),
  }

  return [summaryBlock, sectionsBlock]
}

const buildServiceHubSceneBlocks = (): ContentSceneBlockDto[] => {
  const reminderBlock: ContentServiceHubEntriesBlockDto = {
    blockType: 'service_hub_entries',
    items: Object.values(serviceHubReminderState).map((item) => ({
      ...item,
    })),
  }

  return [reminderBlock]
}

const buildSceneData = (input: ContentSceneRequestDto): ContentSceneDto | null => {
  if (input.sceneId === 'home') {
    return {
      sceneId: 'home',
      version: homeSceneDb.version,
      updatedAt: homeSceneDb.updatedAt,
      blocks: buildHomeSceneBlocks(),
    }
  }

  if (input.sceneId === 'activity') {
    return {
      sceneId: 'activity',
      version: activitySceneDb.version,
      updatedAt: activitySceneDb.updatedAt,
      blocks: buildActivitySceneBlocks(),
    }
  }

  if (input.sceneId === 'profile') {
    return {
      sceneId: 'profile',
      version: profileSceneDb.version,
      updatedAt: profileSceneDb.updatedAt,
      blocks: buildProfileSceneBlocks(),
    }
  }

  if (input.sceneId === 'settings') {
    return {
      sceneId: 'settings',
      version: settingsSceneDb.version,
      updatedAt: settingsSceneDb.updatedAt,
      blocks: buildSettingsSceneBlocks(),
    }
  }

  if (input.sceneId === 'service_hub') {
    return {
      sceneId: 'service_hub',
      version: 1,
      updatedAt: createServerTime(),
      blocks: buildServiceHubSceneBlocks(),
    }
  }

  return {
    sceneId: input.sceneId,
    version: 1,
    updatedAt: createServerTime(),
    blocks: [],
  }
}

export const createContentSceneSnapshot = (sceneId: ContentSceneRequestDto['sceneId']): ContentSceneDto | null => {
  return buildSceneData({ sceneId })
}

export const createContentResourceSnapshot = (
  resourceType: ContentResourceRequestDto['resourceType'],
  resourceId: string,
): ContentResourceDto | null => {
  return buildResourceData({ resourceType, resourceId })
}

const toEnglishSlugLabel = (value: string) =>
  value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const buildServiceActionResource = (actionId: string): ContentResourceDto | null => {
  for (const record of contentServiceEntryDb) {
    for (const section of record.payload.sections) {
      const currentItem = section.items.find(
        (item) => item.target?.targetType === 'service_action' && item.target.targetId === actionId,
      )

      if (!currentItem) {
        continue
      }

      const relatedItems = section.items.filter((item) => item.itemId !== currentItem.itemId)
      const payload: ContentActionEntryPayloadDto = {
        actionId,
        parentId: record.serviceId,
        englishTitle: toEnglishSlugLabel(actionId),
        tone: record.payload.tone,
        statusLabel: record.payload.statusLabel,
        badges: [record.title, ...record.payload.badges].slice(0, 3),
        metrics: record.payload.metrics.slice(0, 2).map((item) => ({ ...item })),
        sections: [
          {
            sectionId: `${record.serviceId}-current`,
            title: '当前动作',
            englishTitle: 'Current Action',
            items: [
              {
                itemId: currentItem.itemId,
                title: currentItem.title,
                description: currentItem.description,
                value: currentItem.value,
              },
            ],
          },
          {
            sectionId: `${record.serviceId}-related`,
            title: '关联能力',
            englishTitle: 'Related Items',
            items: relatedItems.map((item) => ({
              itemId: item.itemId,
              title: item.title,
              description: item.description,
              value: item.value,
              target: item.target ? { ...item.target } : undefined,
            })),
          },
        ],
      }

      return {
        resourceType: 'service_action',
        resourceId: actionId,
        title: currentItem.title,
        subtitle: record.title,
        status: record.status,
        updatedAt: record.updatedAt,
        summary: currentItem.description,
        asset: null,
        payload,
        relations: [
          {
            relationType: 'parent',
            target: {
              targetType: 'service_entry',
              targetId: record.serviceId,
            },
          },
        ],
      }
    }
  }

  return null
}

const buildSettingsActionResource = (actionId: string): ContentResourceDto | null => {
  const sections = settingsSceneDb.sections

  if (settingsSceneDb.summary.actionTarget.targetId === actionId) {
    const payload: ContentActionEntryPayloadDto = {
      actionId,
      parentId: 'settings-summary',
      englishTitle: settingsSceneDb.summary.actionEnglishLabel,
      tone: 'slate',
      statusLabel: 'FEEDBACK_READY',
      badges: ['Settings', 'Feedback'],
      metrics: [
        { metricId: 'sections', label: '设置分组', value: String(sections.length).padStart(2, '0'), caption: 'Groups' },
        { metricId: 'channels', label: '反馈入口', value: '01', caption: 'Channel' },
      ],
      sections: [
        {
          sectionId: 'feedback-current',
          title: '当前动作',
          englishTitle: 'Current Action',
          items: [
            {
              itemId: 'feedback',
              title: settingsSceneDb.summary.actionLabel,
              description: settingsSceneDb.summary.description,
            },
          ],
        },
        {
          sectionId: 'feedback-related',
          title: '相关设置',
          englishTitle: 'Related Settings',
          items: sections.flatMap((section) =>
            section.items.slice(0, 2).map((item) => ({
              itemId: item.itemId,
              title: item.title,
              description: `来自 ${section.title} 分组的相关入口。`,
              value: item.value,
              target: { ...item.target },
            })),
          ),
        },
      ],
    }

    return {
      resourceType: 'settings_action',
      resourceId: actionId,
      title: settingsSceneDb.summary.actionLabel,
      subtitle: settingsSceneDb.summary.title,
      status: 'LIVE',
      updatedAt: settingsSceneDb.updatedAt,
      summary: settingsSceneDb.summary.description,
      asset: null,
      payload,
      relations: [],
    }
  }

  for (const section of sections) {
    const currentItem = section.items.find(
      (item) => item.target.targetType === 'settings_action' && item.target.targetId === actionId,
    )

    if (!currentItem) {
      continue
    }

    const tone = section.sectionId === 'account-security' ? 'green' : 'cyan'
    const payload: ContentActionEntryPayloadDto = {
      actionId,
      parentId: section.sectionId,
      englishTitle: toEnglishSlugLabel(actionId),
      tone,
      statusLabel: 'SETTINGS_READY',
      badges: [section.title, 'Settings'],
      metrics: [
        { metricId: 'current', label: '当前状态', value: currentItem.value, caption: 'Current' },
        { metricId: 'siblings', label: '同组入口', value: String(section.items.length).padStart(2, '0'), caption: 'Entries' },
      ],
      sections: [
        {
          sectionId: `${section.sectionId}-current`,
          title: '当前设置',
          englishTitle: 'Current Setting',
          items: [
            {
              itemId: currentItem.itemId,
              title: currentItem.title,
              description: `${currentItem.title} 当前已纳入统一设置链路，后续直接接真实配置与状态写回。`,
              value: currentItem.value,
            },
          ],
        },
        {
          sectionId: `${section.sectionId}-related`,
          title: '同组设置',
          englishTitle: 'Related Settings',
          items: section.items
            .filter((item) => item.itemId !== currentItem.itemId)
            .map((item) => ({
              itemId: item.itemId,
              title: item.title,
              description: `继续查看 ${section.title} 内的相关配置项。`,
              value: item.value,
              target: { ...item.target },
            })),
        },
      ],
    }

    return {
      resourceType: 'settings_action',
      resourceId: actionId,
      title: currentItem.title,
      subtitle: section.title,
      status: 'LIVE',
      updatedAt: settingsSceneDb.updatedAt,
      summary: `${currentItem.title} 当前已纳入统一设置链路，后续直接接真实配置与状态写回。`,
      asset: null,
      payload,
      relations: [],
    }
  }

  if (actionId === 'logout') {
    const payload: ContentActionEntryPayloadDto = {
      actionId,
      parentId: 'settings-summary',
      englishTitle: 'Logout Flow',
      tone: 'slate',
      statusLabel: 'LOGOUT_READY',
      badges: ['Account', 'Logout'],
      metrics: [
        { metricId: 'steps', label: '流程阶段', value: '03', caption: 'Steps' },
        { metricId: 'risk', label: '风险检查', value: '01', caption: 'Check' },
      ],
      sections: [
        {
          sectionId: 'logout-current',
          title: '退出流程',
          englishTitle: 'Logout Flow',
          items: [
            {
              itemId: 'logout-confirm',
              title: '退出登录',
              description: '后续接入账户状态清理、钱包解绑确认与回到首页流程。',
            },
          ],
        },
      ],
    }

    return {
      resourceType: 'settings_action',
      resourceId: actionId,
      title: '退出登录',
      subtitle: '系统设置',
      status: 'LIVE',
      updatedAt: settingsSceneDb.updatedAt,
      summary: '后续接入账户状态清理、钱包解绑确认与回到首页流程。',
      asset: null,
      payload,
      relations: [],
    }
  }

  return null
}

const buildHomeBannerResource = (bannerId: string): ContentResourceDto | null => {
  const item = homeSceneDb.banners.find((record) => record.bannerId === bannerId)
  if (!item) {
    return null
  }

  const asset = cloneContentAsset(item.assetId)
  if (!asset) {
    return null
  }

  const payload: ContentHomeBannerPayloadDto = {
    liveLabel: item.liveLabel,
    tone: item.tone,
  }

  return {
    resourceType: 'home_banner',
    resourceId: item.bannerId,
    title: item.title,
    subtitle: '首页主视觉',
    status: 'LIVE',
    updatedAt: homeSceneDb.updatedAt,
    summary: `${item.title} 当前作为首页主视觉成品图资源输出，后续继续由后台上传图资源并按同一资源 ID 维护。`,
    asset,
    payload,
    relations: [],
  }
}

const buildMarketActionResource = (actionId: string): ContentResourceDto | null => {
  if (actionId !== 'search' && actionId !== 'history') {
    return null
  }

  const actionRecord = homeMarketActionDb[actionId]
  if (!actionRecord) {
    return null
  }

  const tone = actionId === 'search' ? 'cyan' : 'slate'
  const relatedActionId = actionId === 'search' ? 'history' : 'search'
  const relatedAction = homeMarketActionDb[relatedActionId]
  const relatedItems = homeSceneDb.market.itemIds
    .map((itemId) => contentMarketItemDb.find((item) => item.itemId === itemId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 3)

  const payload: ContentActionEntryPayloadDto = {
    actionId,
    parentId: 'home-market',
    englishTitle: actionId === 'search' ? 'Market Search' : 'Order History',
    tone,
    statusLabel: 'MARKET_READY',
    badges: ['Market', actionId === 'search' ? 'Search' : 'History'],
    metrics: [
      { metricId: 'categories', label: '市场分区', value: String(homeSceneDb.market.categoryIds.length).padStart(2, '0'), caption: 'Tags' },
      { metricId: 'items', label: '藏品数量', value: String(homeSceneDb.market.itemIds.length).padStart(2, '0'), caption: 'Items' },
    ],
    sections: [
      {
        sectionId: `market-${actionId}-current`,
        title: '当前动作',
        englishTitle: 'Current Action',
        items: [
          {
            itemId: actionId,
            title: actionId === 'search' ? '打开市场搜索' : '查看历史订单',
            description: actionId === 'search' ? '进入统一搜索入口，按分类和关键字筛选市场藏品。' : '进入统一历史订单入口，查看近期市场链路记录。',
            value: actionId === 'search' ? 'SEARCH' : 'HISTORY',
          },
        ],
      },
      {
        sectionId: `market-${actionId}-related`,
        title: '关联入口',
        englishTitle: 'Related Entries',
        items: [
          {
            itemId: relatedActionId,
            title: relatedAction?.label ?? relatedActionId,
            description: '查看市场的另一条正式动作链路。',
            target: relatedAction ? { ...relatedAction.target } : undefined,
          },
          ...relatedItems.map((item) => ({
            itemId: item.itemId,
            title: item.title,
            description: '直接跳转到对应的正式藏品资源页。',
            value: item.itemId,
            target: {
              targetType: 'market_item' as const,
              targetId: item.itemId,
            },
          })),
        ],
      },
    ],
  }

  return {
    resourceType: 'market_action',
    resourceId: actionId,
    title: actionRecord.label,
    subtitle: '藏品市场动作',
    status: 'LIVE',
    updatedAt: homeSceneDb.updatedAt,
    summary: actionId === 'search' ? '统一承接首页市场搜索动作，后续继续接真实后台搜索链路。' : '统一承接首页市场历史订单动作，后续继续接真实后台订单链路。',
    asset: null,
    payload,
    relations: [],
  }
}

const buildActivityResource = (entryId: string): ContentResourceDto | null => {
  const item = activitySceneDb.entries.find((record) => record.entryId === entryId)
  if (!item) {
    return null
  }

  const payload: ContentActivityPayloadDto = {
    eyebrow: item.eyebrow,
    description: item.description,
    tone: item.tone,
    badgeLabel: item.badgeLabel,
  }

  return {
    resourceType: 'activity',
    resourceId: item.entryId,
    title: item.title,
    subtitle: '活动详情',
    status: 'LIVE',
    updatedAt: activitySceneDb.updatedAt,
    summary: item.description,
    asset: null,
    payload,
    relations: [],
  }
}

const buildResourceData = (input: ContentResourceRequestDto): ContentResourceDto | null => {
  if (input.resourceType === 'notice') {
    const item = contentNoticeDb.find((record) => record.noticeId === input.resourceId)
    if (!item) {
      return null
    }

    const payload: ContentNoticePayloadDto = {
      time: item.time,
      isUnread: noticeUnreadState[item.noticeId] ?? false,
      englishTitle: item.englishTitle,
      badges: [...item.badges],
      blocks: cloneNoticeBlocks(item.blocks),
    }

    return {
      resourceType: 'notice',
      resourceId: item.noticeId,
      title: item.title,
      subtitle: item.type,
      status: item.status,
      updatedAt: item.updatedAt,
      summary: item.summary,
      asset: null,
      payload,
      relations: [],
    }
  }

  if (input.resourceType === 'home_banner') {
    return buildHomeBannerResource(input.resourceId)
  }

  if (input.resourceType === 'activity') {
    return buildActivityResource(input.resourceId)
  }

  if (input.resourceType === 'drop') {
    const item = contentDropDb.find((record) => record.dropId === input.resourceId)
    if (!item) {
      return null
    }

    return {
      resourceType: 'drop',
      resourceId: item.dropId,
      title: item.title,
      subtitle: item.subtitle,
      status: item.status,
      updatedAt: item.updatedAt,
      summary: item.summary,
      asset: cloneContentAsset(item.assetId),
      payload: {
        sectionTitle: item.sectionTitle,
        sectionSubtitle: item.sectionSubtitle,
        priceLabel: item.priceLabel,
        currency: item.currency,
        priceInCent: item.priceInCent,
        mintedCount: item.mintedCount,
        supplyCount: item.supplyCount,
        placeholderIconKey: item.placeholderIconKey,
      },
      relations: [],
    }
  }

  if (input.resourceType === 'market_action') {
    return buildMarketActionResource(input.resourceId)
  }

  if (input.resourceType === 'market_item') {
    const item = contentMarketItemDb.find((record) => record.itemId === input.resourceId)
    if (!item) {
      return null
    }

    return {
      resourceType: 'market_item',
      resourceId: item.itemId,
      title: item.title,
      status: item.status,
      updatedAt: item.updatedAt,
      summary: item.summary,
      asset: cloneContentAsset(item.assetId),
      payload: {
        currency: item.currency,
        priceInCent: item.priceInCent,
        categoryIds: [...item.categoryIds],
        placeholderIconKey: item.placeholderIconKey,
        visualTone: item.visualTone,
        badgeType: item.badgeType,
        badgeLabel: item.badgeLabel,
      },
      relations: [],
    }
  }

  if (input.resourceType === 'category') {
    const item = contentCategoryDb.find((record) => record.categoryId === input.resourceId)
    if (!item) {
      return null
    }

    return {
      resourceType: 'category',
      resourceId: item.categoryId,
      title: item.categoryName,
      status: item.status,
      updatedAt: item.updatedAt,
      asset: null,
      payload: {},
      relations: [],
    }
  }

  if (input.resourceType === 'asset') {
    const asset = cloneContentAsset(input.resourceId)
    if (!asset) {
      return null
    }

    return {
      resourceType: 'asset',
      resourceId: asset.assetId,
      title: asset.assetId,
      status: 'online',
      updatedAt: createServerTime(),
      asset,
      payload: {
        width: asset.width,
        height: asset.height,
      },
      relations: [],
    }
  }

  if (input.resourceType === 'service_entry') {
    const item = cloneContentServiceEntry(input.resourceId as ContentServiceEntryPayloadDto['serviceId'])
    if (!item) {
      return null
    }

    return {
      resourceType: 'service_entry',
      resourceId: item.serviceId,
      title: item.title,
      status: item.status,
      updatedAt: item.updatedAt,
      summary: item.summary,
      asset: null,
      payload: item.payload,
      relations: item.relations ?? [],
    }
  }

  if (input.resourceType === 'service_action') {
    return buildServiceActionResource(input.resourceId)
  }

  if (input.resourceType === 'settings_action') {
    return buildSettingsActionResource(input.resourceId)
  }

  if (input.resourceType === 'profile_asset') {
    const item = profileSceneDb.assets.items.find((record) => record.itemId === input.resourceId)
    if (!item) {
      return null
    }

    return {
      resourceType: 'profile_asset',
      resourceId: item.itemId,
      title: item.title,
      status: 'OWNED',
      updatedAt: item.acquiredAt,
      summary: item.subCategory,
      asset: null,
      payload: {
        categoryId: item.categoryId,
        subCategory: item.subCategory,
        acquiredAt: item.acquiredAt,
      },
      relations: [
        {
          relationType: 'category',
          target: {
            targetType: 'category',
            targetId: item.categoryId,
          },
        },
      ],
    }
  }

  return null
}

const buildListData = (input: ContentListRequestDto): ContentListDto => {
  if (input.resourceType === 'market_item') {
    const filtered = contentMarketItemDb.filter((item) => {
      const matchCategory = !input.categoryId || input.categoryId === 'all' || item.categoryIds.includes(input.categoryId)
      const matchKeyword = !input.keyword || item.title.includes(input.keyword)
      return matchCategory && matchKeyword
    })

    const pageStart = (input.page - 1) * input.pageSize
    const pageItems = filtered.slice(pageStart, pageStart + input.pageSize)
    const items: ContentListItemDto[] = pageItems.map((item) => ({
      resourceType: 'market_item',
      resourceId: item.itemId,
      title: item.title,
      status: item.status,
      updatedAt: item.updatedAt,
      summary: item.summary,
      asset: cloneContentAsset(item.assetId),
      target: {
        targetType: 'market_item',
        targetId: item.itemId,
      },
      payload: {
        currency: item.currency,
        priceInCent: item.priceInCent,
        categoryIds: [...item.categoryIds],
        placeholderIconKey: item.placeholderIconKey,
        visualTone: item.visualTone,
        badgeType: item.badgeType,
        badgeLabel: item.badgeLabel,
      },
    }))

    return {
      resourceType: 'market_item',
      page: input.page,
      pageSize: input.pageSize,
      total: filtered.length,
      items,
    }
  }

  if (input.resourceType === 'profile_asset') {
    const normalizedKeyword = input.keyword?.trim() ?? ''
    const filtered = profileSceneDb.assets.items.filter((item) => {
      const matchCategory = !input.categoryId || input.categoryId === 'all' || item.categoryId === input.categoryId
      const matchKeyword =
        !normalizedKeyword || item.title.includes(normalizedKeyword) || item.itemId.toLowerCase().includes(normalizedKeyword.toLowerCase())

      return matchCategory && matchKeyword
    })

    const pageStart = (input.page - 1) * input.pageSize
    const pageItems = filtered.slice(pageStart, pageStart + input.pageSize)
    const items: ContentListItemDto[] = pageItems.map((item) => ({
      resourceType: 'profile_asset',
      resourceId: item.itemId,
      title: item.title,
      status: 'OWNED',
      updatedAt: item.acquiredAt,
      summary: item.subCategory,
      asset: null,
      target: {
        targetType: 'profile_asset',
        targetId: item.itemId,
      },
      payload: {
        categoryId: item.categoryId,
        subCategory: item.subCategory,
        acquiredAt: item.acquiredAt,
      },
    }))

    return {
      resourceType: 'profile_asset',
      page: input.page,
      pageSize: input.pageSize,
      total: filtered.length,
      items,
    }
  }

  return {
    resourceType: input.resourceType,
    page: input.page,
    pageSize: input.pageSize,
    total: 0,
    items: [],
  }
}

const runAction = (input: ContentActionRequestDto): ContentActionResultDto => {
  if (input.actionType === 'notice-read') {
    noticeUnreadState = {
      ...noticeUnreadState,
      [input.noticeId]: false,
    }

    return {
      noticeId: input.noticeId,
      isUnread: noticeUnreadState[input.noticeId] ?? false,
    }
  }

  if (input.actionType === 'service-reminder-consume') {
    const currentState = serviceHubReminderState[input.serviceId]
    if (!currentState) {
      return {
        serviceId: input.serviceId,
        hasReminder: false,
        unreadCount: 0,
      }
    }

    serviceHubReminderState = {
      ...serviceHubReminderState,
      [input.serviceId]: {
        ...currentState,
        hasReminder: false,
        unreadCount: 0,
      },
    }

    return {
      serviceId: input.serviceId,
      hasReminder: serviceHubReminderState[input.serviceId].hasReminder,
      unreadCount: serviceHubReminderState[input.serviceId].unreadCount,
      latestMessageId: serviceHubReminderState[input.serviceId].latestMessageId,
      latestMessageAt: serviceHubReminderState[input.serviceId].latestMessageAt,
    }
  }

  return {
    noticeId: '',
    isUnread: false,
  }
}

export const contentMockImplementation: ContentPort = {
  async getScene(input) {
    return createEnvelope(buildSceneData(input), 'req_scene')
  },
  async getResource(input) {
    return createEnvelope(buildResourceData(input), 'req_resource')
  },
  async getList(input) {
    return createEnvelope(buildListData(input), 'req_list')
  },
  async runAction(input) {
    return createEnvelope(runAction(input), 'req_action')
  },
}
