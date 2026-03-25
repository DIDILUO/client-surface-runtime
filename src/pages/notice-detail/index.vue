<template>
  <StandalonePageScaffold route-source="notice-detail-page">
    <template #default="{ canOpenDrawer, openDrawer }">
      <view class="notice-page">
        <scroll-view class="notice-scroll" scroll-y>
          <view class="notice-flow">
            <view class="notice-header">
              <HomeInteractiveTarget
                class="notice-back-entry"
                interaction-mode="compact"
                label="返回上一页"
                @activate="handleBack"
              >
                <ArrowLeft :size="20" :stroke-width="1.9" />
              </HomeInteractiveTarget>

              <view class="notice-header-copy">
                <text class="notice-header-title">公告详情</text>
                <text class="notice-header-subtitle">{{ notice.englishTitle }}</text>
              </view>

              <HomeInteractiveTarget
                v-if="canOpenDrawer"
                class="notice-menu-entry"
                interaction-mode="compact"
                label="打开更多服务"
                @activate="openDrawer"
              >
                <Menu :size="20" :stroke-width="1.9" />
              </HomeInteractiveTarget>
              <view v-else class="notice-header-spacer" aria-hidden="true" />
            </view>

            <view class="notice-hero-card">
              <view class="notice-hero-glow" />

              <view class="notice-meta-row">
                <view class="notice-type-pill" :class="`tone-${resolveTypeTone(notice.type)}`">
                  <text class="notice-type-pill-text">{{ notice.type }}</text>
                </view>
                <view class="notice-status-pill" :class="`tone-${resolveStatusTone(notice.status)}`">
                  <text class="notice-status-pill-text">{{ notice.status }}</text>
                </view>
                <text class="notice-time">{{ notice.time }}</text>
              </view>

              <text class="notice-title">{{ notice.title }}</text>
              <text class="notice-summary">{{ notice.summary }}</text>

              <view v-if="notice.badges.length" class="notice-badge-row">
                <view v-for="badge in notice.badges" :key="badge" class="notice-badge-chip">
                  <text class="notice-badge-chip-text">{{ badge }}</text>
                </view>
              </view>
            </view>

            <view class="notice-article-card">
              <view class="notice-article-head">
                <text class="notice-article-title">正文内容</text>
                <text class="notice-article-subtitle">ARTICLE</text>
              </view>

              <view class="notice-article-body">
                <view v-for="block in notice.blocks" :key="block.id" class="notice-article-block">
                  <template v-if="block.kind === 'paragraph'">
                    <text class="notice-article-paragraph">{{ block.text }}</text>
                  </template>

                  <template v-else>
                    <view class="notice-article-list-wrap">
                      <text v-if="block.title" class="notice-article-list-title">{{ block.title }}</text>
                      <view class="notice-article-list">
                        <view v-for="item in block.items" :key="item" class="notice-article-list-item">
                          <view class="notice-article-list-dot" />
                          <text class="notice-article-list-text">{{ item }}</text>
                        </view>
                      </view>
                    </view>
                  </template>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </template>
  </StandalonePageScaffold>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { ArrowLeft, Menu } from 'lucide-vue-next'
import type { ContentNoticeBlockDto, ContentNoticePayloadDto } from '../../contracts/content-api.contract'
import StandalonePageScaffold from '../../components/StandalonePageScaffold.vue'
import { createContentResourceSnapshot } from '../../implementations/content.mock'
import { parseNoticeDetailRouteQuery } from '../../services/routeQuery.service'
import {
  consumeHomeAnnouncementUnread,
  isContentNoticeId,
  isHomeAnnouncementNoticeId,
} from '../../services/homeNoticeState.service'
import { resolveContentResource } from '../../services/content.service'
import HomeInteractiveTarget from '../home/components/HomeInteractiveTarget.vue'

const defaultNotice: {
  noticeId: string
  type: string
  status: string
  time: string
  title: string
  englishTitle: string
  summary: string
  badges: string[]
  blocks: ContentNoticeBlockDto[]
} = {
  noticeId: 'N-BASE-001',
  type: '系统公告',
  status: 'NEW',
  time: '10-23',
  title: '第 0 批次核心资产 [合成黎明] 铸造通道正式开启',
  englishTitle: 'NOTICE DETAIL',
  summary: '',
  badges: [],
  blocks: [],
}

function cloneContentNoticeBlocks(blocks: ContentNoticeBlockDto[]): ContentNoticeBlockDto[] {
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

const snapshotNotice = createContentResourceSnapshot('notice', defaultNotice.noticeId)
const snapshotPayload = snapshotNotice?.payload as ContentNoticePayloadDto | undefined
defaultNotice.summary = snapshotNotice?.summary ?? defaultNotice.summary
defaultNotice.badges = snapshotPayload?.badges ? [...snapshotPayload.badges] : defaultNotice.badges
defaultNotice.blocks = snapshotPayload?.blocks ? cloneContentNoticeBlocks(snapshotPayload.blocks) : defaultNotice.blocks

const notice = reactive({
  ...defaultNotice,
  badges: [...defaultNotice.badges],
  blocks: [...defaultNotice.blocks],
})

const withSourceBadges = (source: string, badges: string[]) => {
  const normalizedSource = source.trim().toUpperCase()
  return normalizedSource ? [normalizedSource, ...badges.slice(1)] : [...badges]
}

const applyFallbackNoticeMeta = (input: {
  noticeId: string
  type: string
  status: string
  time: string
  title: string
  source: string
}) => {
  notice.noticeId = input.noticeId || defaultNotice.noticeId
  notice.type = input.type || defaultNotice.type
  notice.status = input.status || defaultNotice.status
  notice.time = input.time || defaultNotice.time
  notice.title = input.title || defaultNotice.title
}

const hydrateNoticeDetail = async (noticeId: string, source: string) => {
  if (isHomeAnnouncementNoticeId(noticeId)) {
    await consumeHomeAnnouncementUnread(noticeId)
  }

  const resource = await resolveContentResource({
    resourceType: 'notice',
    resourceId: noticeId,
  })

  const payload = resource.payload as Partial<ContentNoticePayloadDto>
  const fallbackResource = createContentResourceSnapshot('notice', noticeId)
  const fallbackPayload = fallbackResource?.payload as ContentNoticePayloadDto | undefined
  const payloadTime = typeof payload.time === 'string' ? payload.time : defaultNotice.time
  const payloadEnglishTitle = typeof payload.englishTitle === 'string' ? payload.englishTitle : defaultNotice.englishTitle
  const payloadBadges = Array.isArray(payload.badges)
    ? payload.badges.filter((item): item is string => typeof item === 'string')
    : [...(fallbackPayload?.badges ?? defaultNotice.badges)]
  const payloadBlocks = Array.isArray(payload.blocks)
    ? cloneContentNoticeBlocks(payload.blocks as ContentNoticeBlockDto[])
    : cloneContentNoticeBlocks(fallbackPayload?.blocks ?? defaultNotice.blocks)

  notice.noticeId = resource.resourceId
  notice.type = resource.subtitle || defaultNotice.type
  notice.status = 'LIVE'
  notice.time = payloadTime
  notice.title = resource.title || defaultNotice.title
  notice.englishTitle = payloadEnglishTitle
  notice.summary = resource.summary || fallbackResource?.summary || defaultNotice.summary
  notice.badges = withSourceBadges(source, payloadBadges)
  notice.blocks = payloadBlocks
}

const resolveTypeTone = (type: string) => {
  const normalizedType = type.trim()

  if (normalizedType.includes('维护')) {
    return 'amber'
  }

  if (normalizedType.includes('安全')) {
    return 'red'
  }

  if (normalizedType.includes('活动')) {
    return 'cyan'
  }

  return 'slate'
}

const resolveStatusTone = (status: string) => {
  const normalizedStatus = status.trim().toUpperCase()

  if (normalizedStatus === 'NEW' || normalizedStatus === 'LIVE') {
    return 'cyan'
  }

  if (normalizedStatus === 'HOT') {
    return 'amber'
  }

  return 'slate'
}

onLoad((query) => {
  const routeQuery = parseNoticeDetailRouteQuery(query as Record<string, unknown>)
  const { noticeId, type, status, time, title, source } = routeQuery

  const nextNoticeId = noticeId || defaultNotice.noticeId
  applyFallbackNoticeMeta({
    noticeId: nextNoticeId,
    type: type || defaultNotice.type,
    status: status || defaultNotice.status,
    time: time || defaultNotice.time,
    title: title || defaultNotice.title,
    source,
  })

  if (!isContentNoticeId(nextNoticeId)) {
    return
  }

  void hydrateNoticeDetail(nextNoticeId, source).catch((error) => {
    console.error('[notice-detail] failed to hydrate notice detail', error)
  })
})

const handleBack = () => {
  if (getCurrentPages().length > 1) {
    uni.navigateBack()
    return
  }

  uni.switchTab({
    url: '/pages/home/index',
  })
}
</script>

<style lang="scss" scoped>
.notice-page {
  width: 100%;
  min-height: 100dvh;
  background:
    radial-gradient(circle at top right, rgba(34, 211, 238, 0.08), transparent 36%),
    linear-gradient(180deg, #fafafa 0%, #f4f5f7 100%);
}

.notice-scroll {
  height: 100dvh;
}

.notice-flow {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px 16px 32px;
  box-sizing: border-box;
}

.notice-header {
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
}

.notice-back-entry,
.notice-menu-entry,
.notice-header-spacer {
  width: 44px;
  height: 44px;
}

.notice-back-entry,
.notice-menu-entry {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111827;
}

.notice-header-copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.notice-header-title {
  color: #111111;
  font-size: 24px;
  line-height: 28px;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.notice-header-subtitle {
  color: #22d3ee;
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  letter-spacing: 0.18em;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.notice-hero-card,
.notice-article-card {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 0 28px rgba(15, 23, 42, 0.06);
}

.notice-hero-card {
  padding: 20px;
}

.notice-hero-glow {
  position: absolute;
  right: -36px;
  top: -44px;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  background: radial-gradient(circle at center, rgba(34, 211, 238, 0.18), transparent 72%);
}

.notice-meta-row,
.notice-title,
.notice-summary,
.notice-badge-row {
  position: relative;
  z-index: 1;
}

.notice-meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.notice-type-pill,
.notice-status-pill,
.notice-badge-chip {
  min-height: 24px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
}

.notice-type-pill.tone-cyan,
.notice-status-pill.tone-cyan {
  background: rgba(236, 254, 255, 0.98);
  color: #0891b2;
}

.notice-type-pill.tone-slate,
.notice-status-pill.tone-slate,
.notice-badge-chip {
  background: #f4f5f7;
  color: #64748b;
}

.notice-type-pill.tone-amber,
.notice-status-pill.tone-amber {
  background: rgba(255, 247, 237, 0.98);
  color: #ea580c;
}

.notice-type-pill.tone-red,
.notice-status-pill.tone-red {
  background: rgba(254, 242, 242, 0.98);
  color: #dc2626;
}

.notice-type-pill-text,
.notice-status-pill-text,
.notice-badge-chip-text {
  font-size: 12px;
  line-height: 12px;
  font-weight: 700;
}

.notice-time {
  color: #94a3b8;
  font-size: 12px;
  line-height: 12px;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.notice-title {
  margin-top: 16px;
  color: #111111;
  font-size: 24px;
  line-height: 32px;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.notice-summary {
  margin-top: 12px;
  color: #64748b;
  font-size: 14px;
  line-height: 24px;
}

.notice-badge-row {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.notice-article-card {
  padding: 20px;
}

.notice-article-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.notice-article-title {
  color: #111111;
  font-size: 20px;
  line-height: 24px;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.notice-article-subtitle {
  color: #22d3ee;
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  letter-spacing: 0.18em;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.notice-article-body {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.notice-article-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice-article-paragraph,
.notice-article-list-text {
  color: #475569;
  font-size: 14px;
  line-height: 28px;
}

.notice-article-list-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice-article-list-title {
  color: #111111;
  font-size: 14px;
  line-height: 20px;
  font-weight: 800;
}

.notice-article-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice-article-list-item {
  display: grid;
  grid-template-columns: 8px 1fr;
  align-items: start;
  gap: 8px;
}

.notice-article-list-dot {
  width: 6px;
  height: 6px;
  margin-top: 10px;
  border-radius: 999px;
  background: #22d3ee;
}
</style>

