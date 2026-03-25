<!--
文件版本：v0030
更新时间：2026-03-25 19:30:00
Encoding: UTF-8
本次更新：重做市场分区模块，改为稳定槽位与统一滑动指示线-->

<template>
  <view class="home-panel">
    <view class="home-banner-carousel">
      <view class="home-banner-ratio-shell">
        <swiper class="home-banner-swiper" circular autoplay :interval="5600" :duration="620">
          <swiper-item v-for="item in homeBannerItems" :key="item.id">
            <view class="home-banner-slide-shell">
              <HomeInteractiveTarget
                class="home-banner-entry"
                :class="[`tone-${item.tone}`, { 'has-image': Boolean(item.imageUrl) }]"
                :label="`查看 ${item.title}`"
                @activate="handleBannerClick(item)"
              >
                <image
                  v-if="item.imageUrl"
                  class="home-banner-bg"
                  :src="item.imageUrl"
                  :style="resolveBannerImageStyle(item)"
                  mode="aspectFill"
                />
                <template v-else>
                  <view class="home-banner-live">
                    <view class="home-banner-live-dot" />
                    <text class="home-banner-live-text">
                      <text class="home-safe-mini-text home-safe-mini-text-9 home-banner-live-mini">{{ item.liveLabel }}</text>
                    </text>
                  </view>

                  <view class="home-banner-bottom">
                    <view class="home-banner-copy">
                      <view class="home-banner-id">
                        <text class="home-banner-id-copy">ID: {{ item.id }}</text>
                      </view>
                      <text class="home-banner-title">{{ item.title }}</text>
                    </view>

                    <view class="home-banner-arrow-wrap">
                      <ArrowUpRight class="home-banner-arrow-icon" :size="16" :stroke-width="2.2" />
                    </view>
                  </view>
                </template>
              </HomeInteractiveTarget>
            </view>
          </swiper-item>
        </swiper>
      </view>
    </view>

    <HomeInteractiveTarget class="home-notice-hit" :label="noticeBar.detailLabel" @activate="handleAnnouncementClick">
      <view class="home-notice-bar">
        <Bell class="home-notice-bell-icon" :size="16" :stroke-width="2.4" />

        <view class="home-notice-copy">
          <text class="home-notice-label">{{ noticeBar.label }}</text>
          <swiper
            class="home-notice-swiper"
            vertical
            circular
            autoplay
            :interval="5200"
            :duration="560"
            @change="handleNoticeSwiperChange"
          >
            <swiper-item v-for="item in homeAnnouncementItems" :key="item.noticeId">
              <view class="home-notice-swiper-item">
                <view v-if="item.isUnread" class="home-notice-badge">
                  <view class="home-notice-badge-copy">
                    <text class="home-notice-badge-text">NEW</text>
                  </view>
                </view>
                <text class="home-notice-title">{{ item.title }}</text>
              </view>
            </swiper-item>
          </swiper>
        </view>
      </view>
    </HomeInteractiveTarget>

    <view class="home-featured-layout">
      <view class="home-featured-copy">
        <view class="home-featured-title-slot">
          <text class="home-featured-title">{{ bannerDrop.sectionTitle }}</text>
          <text class="home-featured-subtitle">{{ bannerDrop.sectionSubtitle }}</text>
        </view>

        <view class="home-featured-info-card">
          <view class="home-featured-info-safe">
            <view class="home-featured-price-row">
              <text class="home-featured-price-label">{{ bannerDrop.priceLabel }}</text>
              <view class="home-featured-price-value">
                <text class="home-featured-price-unit">{{ bannerDrop.priceUnit }}</text>
                <text class="home-featured-price-main">{{ bannerDrop.price }}</text>
              </view>
            </view>

            <view class="home-featured-progress-stack">
              <view class="home-featured-progress-meta">
                <text class="home-featured-progress-num">{{ bannerDrop.minted }}</text>
                <text class="home-featured-progress-num">{{ bannerDrop.supply }}</text>
              </view>
              <view class="home-featured-progress-track-wrap">
                <view class="home-featured-progress-track">
                  <view class="home-featured-progress-fill" :style="featuredProgressStyle" />
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <HomeInteractiveTarget
        class="home-featured-visual"
        :label="`查看 ${bannerDrop.title}`"
        @activate="handleCollectionQuickEntryClick"
      >
        <image v-if="bannerDrop.imageUrl" class="home-featured-cover" :src="bannerDrop.imageUrl" mode="aspectFill" />
        <component
          :is="featuredPlaceholderIcon"
          v-else
          class="home-featured-placeholder-icon"
          :size="30"
          :stroke-width="1.2"
        />
        <text class="home-featured-id">
          <text class="home-safe-mini-text home-safe-mini-text-8">{{ bannerDrop.id }}</text>
        </text>
      </HomeInteractiveTarget>
    </view>

    <view class="home-market-stack">
      <view class="home-market-head">
        <view class="home-market-title-group">
          <text class="home-market-title">{{ marketContent.sectionTitle }}</text>
          <text class="home-market-subtitle">{{ marketContent.sectionSubtitle }}</text>
        </view>

        <view class="home-market-actions">
          <HomeInteractiveTarget
            class="home-market-action-entry"
            interaction-mode="compact"
            :label="marketSearchAction.label"
            @activate="handleMarketSearchClick"
          >
            <Search class="home-market-action-icon" :size="16" :stroke-width="2" />
          </HomeInteractiveTarget>
          <HomeInteractiveTarget
            class="home-market-action-entry"
            interaction-mode="compact"
            :label="marketHistoryAction.label"
            @activate="handleMarketDocumentClick"
          >
            <History class="home-market-action-icon" :size="16" :stroke-width="2" />
          </HomeInteractiveTarget>
        </view>
      </view>

      <view class="home-market-tag-wrap">
        <scroll-view class="home-market-tag-scroll" scroll-x :show-scrollbar="false">
          <view class="home-market-tag-track">
            <HomeInteractiveTarget
              v-for="(tag, index) in marketTags"
              :key="tag.id"
              class="home-market-tag-entry"
              :class="{ 'is-active': activeMarketTagIndex === index }"
              interaction-mode="compact"
              :selected="activeMarketTagIndex === index"
              :label="`切换到 ${tag.label}`"
              @activate="handleMarketTagSelect(tag, index)"
            >
              <text class="home-market-tag-text">{{ tag.label }}</text>
            </HomeInteractiveTarget>
          </view>
        </scroll-view>
        <view class="home-market-tag-fade-right" />
      </view>

      <view :key="activeMarketTag.id" class="home-market-grid">
        <HomeInteractiveTarget
          v-for="(item, index) in filteredCollection"
          :key="item.id"
          class="home-market-card-entry"
          :label="`查看 ${item.name}`"
          @activate="handleCollectionClick(item)"
        >
          <view class="home-market-card-visual" :class="`tone-${item.visualTone}`">
            <view v-if="item.badge" class="home-market-card-badge" :class="`tone-${item.badge.tone}`">
              <text class="home-market-card-badge-text">{{ item.badge.label }}</text>
            </view>
            <image v-if="item.imageUrl" class="home-market-card-image" :src="item.imageUrl" mode="aspectFill" />
            <component
              :is="resolveMarketPlaceholderIcon(item, index)"
              v-else
              class="home-market-card-placeholder-icon"
              :size="24"
              :stroke-width="1.2"
            />
          </view>

          <view class="home-market-card-copy">
            <text class="home-market-card-name">{{ item.name }}</text>
            <view class="home-market-card-meta">
              <text class="home-market-card-id">{{ item.id }}</text>
              <text class="home-market-card-price">{{ item.priceUnit }} {{ item.price }}</text>
            </view>
          </view>
        </HomeInteractiveTarget>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type CSSProperties, type Component } from 'vue'
import { Aperture, ArrowUpRight, Bell, Box, Cpu, Disc3, Hexagon, History, Search, Triangle } from 'lucide-vue-next'
import HomeInteractiveTarget from './HomeInteractiveTarget.vue'
import {
  buildActionEntryUrl,
  buildContentResourceUrl,
  buildHomeNoticeDetailUrl,
  buildUpdatingUrlByTarget,
} from '../../../services/homeRailNavigation.service'
import { createHomeRailHomeContentShell, resolveHomeRailHomeContent } from '../../../services/homeRailHomeContent.service'
import { consumeHomeAnnouncementUnread } from '../../../services/homeNoticeState.service'
import type {
  HomeAnnouncementItem,
  HomeBannerItem,
  HomeContentTargetRef,
  HomeFeaturedDropContent,
  HomeMarketAction,
  HomeMarketCard,
  HomeMarketTag,
  HomeNoticeBarConfig,
  HomePlaceholderIconKey,
} from '../../../models/homeRailHome.model'

interface Props {
  canOpenDrawer?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canOpenDrawer: false,
})

const emit = defineEmits<{
  openDrawer: []
  bannerClick: []
  announcementClick: []
  marketSearchClick: []
  marketDocumentClick: []
  marketTagSelect: [tag: string, index: number]
  collectionClick: [id: string]
}>()

const homeContent = ref(createHomeRailHomeContentShell())
const noticeBar = computed<HomeNoticeBarConfig>(() => homeContent.value.noticeBar)
const homeBannerItems = computed<HomeBannerItem[]>(() => homeContent.value.banners)
const bannerDrop = computed<HomeFeaturedDropContent>(() => homeContent.value.featured)
const marketContent = computed(() => homeContent.value.market)
const marketTags = computed<HomeMarketTag[]>(() => marketContent.value.tags)
const collection = computed<HomeMarketCard[]>(() => marketContent.value.cards)
const resolveMarketAction = (id: HomeMarketAction['id'], fallbackLabel: string, fallbackSource: string): HomeMarketAction => {
  const action = marketContent.value.actions.find((item) => item.id === id)
  return action ?? {
    id,
    label: fallbackLabel,
    target: {
      targetType: 'market_action',
      targetId: id,
    },
  }
}

const marketSearchAction = computed(() => resolveMarketAction('search', '打开市场搜索', 'home-market-search'))
const marketHistoryAction = computed(() => resolveMarketAction('history', '打开市场历史订单', 'home-market-docs'))

const placeholderIconRegistry: Record<HomePlaceholderIconKey, Component> = {
  box: Box,
  cpu: Cpu,
  aperture: Aperture,
  hexagon: Hexagon,
  triangle: Triangle,
  disc3: Disc3,
}
const marketPlaceholderIconPool: HomePlaceholderIconKey[] = ['hexagon', 'cpu', 'aperture', 'triangle', 'disc3', 'box']
const featuredPlaceholderIcon = computed(() => {
  return placeholderIconRegistry[bannerDrop.value.placeholderIconKey ?? 'box']
})
const resolveMarketPlaceholderIcon = (item: HomeMarketCard, index: number) => {
  const iconKey = item.placeholderIconKey ?? marketPlaceholderIconPool[index % marketPlaceholderIconPool.length] ?? 'box'
  return placeholderIconRegistry[iconKey]
}

const activeAnnouncementIndex = ref(0)
const homeAnnouncementItems = computed<HomeAnnouncementItem[]>(() => noticeBar.value.items)
const activeAnnouncement = computed(() => {
  const items = homeAnnouncementItems.value
  return items[activeAnnouncementIndex.value] ?? items[0]
})

const activeMarketTagIndex = ref(0)
const activeMarketTag = computed(() => {
  return marketTags.value[activeMarketTagIndex.value] ?? marketTags.value[0] ?? { id: 'all', label: '全部' }
})

const featuredProgressStyle = computed(() => {
  const safeSupply = bannerDrop.value.supply > 0 ? bannerDrop.value.supply : 0
  const progress = safeSupply > 0 ? Math.min(100, Math.max(0, (bannerDrop.value.minted / safeSupply) * 100)) : 0
  return { width: `${progress.toFixed(1)}%` }
})

const filteredCollection = computed(() => {
  if (activeMarketTag.value.id === 'all') {
    return collection.value
  }

  return collection.value.filter((item) => item.categories.includes(activeMarketTag.value.id))
})

const buildTargetUrl = (target: HomeContentTargetRef, title: string, source: string) => {
  if (target.targetType === 'home_banner' || target.targetType === 'drop' || target.targetType === 'market_item') {
    return buildContentResourceUrl(target, source)
  }

  if (target.targetType === 'market_action') {
    return buildActionEntryUrl(target, source)
  }

  return buildUpdatingUrlByTarget({
    target,
    title,
    source,
  })
}

const safeNavigate = (url: string) => {
  uni.navigateTo({ url })
}

const handleNoticeSwiperChange = (event: { detail?: { current?: number } }) => {
  activeAnnouncementIndex.value = event.detail?.current ?? 0
}

const markAnnouncementAsReadLocally = (noticeId: string) => {
  const currentNoticeItems = noticeBar.value.items
  if (!currentNoticeItems.some((item) => item.noticeId === noticeId && item.isUnread)) {
    return
  }

  homeContent.value = {
    ...homeContent.value,
    noticeBar: {
      ...homeContent.value.noticeBar,
      items: currentNoticeItems.map((item) =>
        item.noticeId === noticeId
          ? {
              ...item,
              isUnread: false,
            }
          : item,
      ),
    },
  }
}

const handleBannerClick = (banner: HomeBannerItem) => {
  emit('bannerClick')
  safeNavigate(buildTargetUrl(banner.target, `${banner.title} 发布链路`, 'home-banner'))
}

const handleAnnouncementClick = async () => {
  const currentAnnouncement = activeAnnouncement.value
  if (!currentAnnouncement) {
    return
  }

  try {
    const didConsume = await consumeHomeAnnouncementUnread(currentAnnouncement.noticeId)
    if (didConsume) {
      markAnnouncementAsReadLocally(currentAnnouncement.noticeId)
    }
  } catch (error) {
    console.error('[homeRail] failed to consume home announcement unread state', error)
  }

  emit('announcementClick')
  safeNavigate(
    buildHomeNoticeDetailUrl({
      noticeId: currentAnnouncement.noticeId,
      title: currentAnnouncement.title,
      type: currentAnnouncement.type,
      status: 'LIVE',
      time: currentAnnouncement.time,
    }),
  )
}

const handleCollectionQuickEntryClick = () => {
  safeNavigate(buildTargetUrl(bannerDrop.value.target, `${bannerDrop.value.title} 交易链路`, 'home-featured-card'))
}

const handleMarketSearchClick = () => {
  emit('marketSearchClick')
  safeNavigate(buildTargetUrl(marketSearchAction.value.target, marketSearchAction.value.label, 'home-market-search'))
}

const handleMarketDocumentClick = () => {
  emit('marketDocumentClick')
  safeNavigate(buildTargetUrl(marketHistoryAction.value.target, marketHistoryAction.value.label, 'home-market-docs'))
}

const handleMarketTagSelect = (tag: HomeMarketTag, index: number) => {
  activeMarketTagIndex.value = index
  emit('marketTagSelect', tag.label, index)
}

const handleCollectionClick = (item: HomeMarketCard) => {
  emit('collectionClick', item.id)
  safeNavigate(buildTargetUrl(item.target, `${item.name} 交易链路`, 'home-collection'))
}

const resolveBannerImageStyle = (item: HomeBannerItem): CSSProperties => {
  if (!item.focalPoint) {
    return {
      objectPosition: '50% 50%',
    }
  }

  return {
    objectPosition: `${item.focalPoint.x * 100}% ${item.focalPoint.y * 100}%`,
  }
}

onMounted(async () => {
  try {
    homeContent.value = await resolveHomeRailHomeContent()
  } catch (error) {
    console.error('[homeRail] failed to resolve home scene content', error)
  }
})
</script>

<style lang="scss" scoped>
.home-panel {
  display: flex;
  flex-direction: column;
  padding: 0 var(--home-page-inline-padding, 16px);
  box-sizing: border-box;
  background: #fafafa;
  --home-main-module-gap: 24px;
}

.home-banner-carousel + .home-notice-hit {
  margin-top: 8px;
}

.home-notice-hit + .home-featured-layout {
  margin-top: var(--home-main-module-gap);
}

.home-featured-layout + .home-market-stack {
  margin-top: var(--home-main-module-gap);
}

.is-entry-active {
  transform: scale(0.985);
}

.home-banner-entry,
.home-notice-hit,
.home-featured-visual,
.home-market-action-entry,
.home-market-tag-entry,
.home-market-card-entry {
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    filter 180ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .home-banner-entry:hover,
  .home-featured-visual:hover,
  .home-market-card-entry:hover {
    transform: translateY(-2px);
  }

  .home-notice-hit:hover,
  .home-market-action-entry:hover,
  .home-market-tag-entry:hover {
    transform: translateY(-1px);
  }

  .home-notice-hit:hover .home-notice-bar {
    filter: brightness(0.985);
  }

  .home-market-action-entry:hover .home-market-action-icon {
    color: #475569;
  }

  .home-market-tag-entry:hover .home-market-tag-text {
    color: #64748b;
  }
}

.home-banner-carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.home-banner-ratio-shell {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.home-banner-ratio-shell::before {
  content: '';
  display: block;
  padding-top: 48.9795918%;
}

.home-banner-swiper {
  position: absolute;
  inset: 0 auto 0 calc(var(--home-page-inline-padding, 16px) * -1);
  width: calc(100% + (var(--home-page-inline-padding, 16px) * 2));
  height: 100%;
}

.home-banner-slide-shell {
  width: 100%;
  height: 100%;
  padding: 0 var(--home-page-inline-padding, 16px);
  box-sizing: border-box;
}

.home-banner-entry {
  position: relative;
  height: 100%;
  min-height: 0;
  border-radius: 12px;
  overflow: hidden;
  background: #111111;
  color: #ffffff;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 180ms ease;
}

.home-banner-entry.has-image {
  padding: 0;
  display: block;
}

.home-banner-entry.tone-dawn {
  background: #101726;
}

.home-banner-entry.tone-azure {
  background: #0f1f2e;
}

.home-banner-entry.tone-ember {
  background: #1f2530;
}

.home-banner-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  pointer-events: none;
}

.home-banner-live {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 12px;
}

.home-banner-live-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #ffffff;
}

.home-banner-live-text {
  min-height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.home-banner-live-mini {
  vertical-align: middle;
  transform-origin: left center;
}

.home-banner-bottom {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.home-banner-copy {
  min-width: 0;
}

.home-banner-id {
  display: flex;
  align-items: center;
  width: max-content;
  height: 12px;
  margin-bottom: 4px;
  transform: translateX(-8.3333333%) scale(0.8333333);
}

.home-banner-id-copy {
  font-size: 12px;
  line-height: 12px;
  color: #9ca3af;
}

.home-banner-title {
  display: block;
  font-size: 20px;
  line-height: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #ffffff;
}

.home-banner-arrow-wrap {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #ffffff;
  color: #111111;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.home-banner-arrow-icon {
  color: #111111;
  flex-shrink: 0;
}

.home-notice-hit {
  min-height: 44px;
  display: flex;
  align-items: center;
}

.home-notice-bar {
  width: 100%;
  min-height: 40px;
  border-radius: 12px;
  background: #f4f5f7;
  overflow: hidden;
  padding: 0 var(--home-page-inline-padding, 16px);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 4px;
}

.home-notice-bell-icon {
  color: #06b6d4;
  flex-shrink: 0;
}

.home-notice-copy {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.home-notice-swiper {
  flex: 1 1 auto;
  min-width: 0;
  height: 40px;
  width: 100%;
}

.home-notice-swiper-item {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.home-notice-label {
  flex-shrink: 0;
  font-size: 13px;
  line-height: 20px;
  font-weight: 800;
  color: #1f2937;
}

.home-notice-badge {
  --home-notice-badge-width: 40px;
  --home-notice-badge-height: 20px;
  --home-notice-badge-text-scale: 1;
  width: var(--home-notice-badge-width);
  min-width: var(--home-notice-badge-width);
  height: var(--home-notice-badge-height);
  padding: 0;
  border-radius: 999px;
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.home-notice-badge-copy {
  min-width: 12px;
  height: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: scale(var(--home-notice-badge-text-scale, 1));
  transform-origin: center center;
}

.home-notice-badge-text {
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.06em;
  font-weight: 800;
  font-family: inherit;
}

.home-notice-title {
  min-width: 0;
  width: 100%;
  font-size: 13px;
  line-height: 20px;
  font-weight: 600;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.home-featured-layout {
  position: relative;
  min-height: 144px;
}

.home-featured-copy {
  position: relative;
  z-index: 1;
  min-height: 144px;
  height: 144px;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: 24px 8px 104px 8px;
  align-items: stretch;
  justify-content: stretch;
}

.home-featured-title-slot {
  min-height: 24px;
  height: 24px;
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
  gap: 8px;
}

.home-featured-title {
  font-size: 16px;
  line-height: 20px;
  font-weight: 900;
  color: #111111;
}

.home-featured-subtitle {
  min-height: 12px;
  display: inline-block;
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  color: #22d3ee;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  transform: scale(0.75);
  transform-origin: left bottom;
  vertical-align: baseline;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.home-featured-info-card {
  position: relative;
  grid-row: 3 / span 1;
  min-height: 104px;
  height: 104px;
  width: calc(100% - 128px);
  border-radius: 16px;
  background-color: #f4f5f7;
  background-image: linear-gradient(135deg, rgba(34, 211, 238, 0.045) 0%, rgba(34, 211, 238, 0.015) 26%, rgba(34, 211, 238, 0) 48%);
  overflow: hidden;
  box-sizing: border-box;
}

.home-featured-info-card::before {
  content: '';
  position: absolute;
  left: 16px;
  top: 0;
  width: 40px;
  height: 2px;
  border-radius: 0 0 999px 999px;
  background: rgba(34, 211, 238, 0.78);
  pointer-events: none;
}

.home-featured-info-safe {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  padding: 20px 32px 20px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0;
}

.home-featured-price-row {
  min-height: 24px;
  height: 24px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.home-featured-price-label {
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: #7c8da3;
}

.home-featured-price-value {
  display: inline-flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 4px;
}

.home-featured-price-unit {
  font-size: 12px;
  line-height: 16px;
  font-weight: 800;
  color: #111111;
}

.home-featured-price-main {
  font-size: 20px;
  line-height: 20px;
  font-weight: 900;
  color: #111111;
}

.home-featured-progress-stack {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 4px;
  box-sizing: border-box;
}

.home-featured-progress-meta {
  min-height: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.home-featured-progress-num {
  font-size: 12px;
  line-height: 12px;
  color: #6b7280;
  transform-origin: center center;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.home-featured-progress-track-wrap {
  min-height: 4px;
  height: 4px;
  display: flex;
  align-items: center;
}

.home-featured-progress-track {
  width: 100%;
  height: 4px;
  border-radius: 999px;
  overflow: hidden;
  background: #d1d5db;
}

.home-featured-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #22d3ee 0%, #38bdf8 100%);
}

.home-featured-visual {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
  height: 144px;
  width: 144px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #eef2f7;
  background: #ffffff;
  box-shadow: var(--aether-shadow-soft, 0 0 24px rgba(15, 23, 42, 0.06));
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-featured-cover {
  width: 100%;
  height: 100%;
}

.home-featured-placeholder-icon {
  color: #cbd5e1;
}

.home-featured-id {
  position: absolute;
  right: 8px;
  bottom: 8px;
  color: #cbd5e1;
}

.home-market-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.home-market-head {
  padding-left: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
}

.home-market-title-group {
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.home-market-title {
  font-size: 16px;
  line-height: 20px;
  font-weight: 900;
  color: #111111;
}

.home-market-subtitle {
  min-height: 12px;
  display: inline-block;
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  text-transform: uppercase;
  color: #22d3ee;
  letter-spacing: 0.18em;
  transform: scale(0.75);
  transform-origin: left bottom;
  vertical-align: baseline;
}

.home-market-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: visible;
}

.home-market-action-entry {
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  overflow: visible;
}

.home-market-action-icon {
  position: relative;
  z-index: 1;
  color: #6b7280;
  flex-shrink: 0;
  pointer-events: none;
}

.home-market-tag-scroll {
  width: 100%;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.home-market-tag-wrap {
  position: relative;
  width: 100%;
}

.home-market-tag-scroll::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.home-market-tag-track {
  display: flex;
  align-items: center;
  gap: 8px;
  width: max-content;
  min-width: auto;
  padding: 0 24px 0 0;
  box-sizing: border-box;
}

.home-market-tag-entry {
  position: relative;
  flex: 0 0 auto;
  min-width: 0;
  min-height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  box-sizing: border-box;
  overflow: visible;
  border-radius: 999px;
  border: none;
  background: #f4f5f7;
  transition:
    transform 180ms ease,
    background-color 180ms ease,
    box-shadow 180ms ease;
}

.home-market-tag-text {
  position: relative;
  z-index: 1;
  min-height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  max-width: calc(4 * 12px);
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 160ms ease;
}

.home-market-tag-fade-right {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 24px;
  pointer-events: none;
  background: linear-gradient(270deg, #fafafa 0%, rgba(250, 250, 250, 0) 100%);
}

.home-market-tag-entry.is-active .home-market-tag-text {
  color: #ffffff;
}

.home-market-tag-entry.is-active {
  background: #111111;
  box-shadow: none;
}

.home-market-tag-entry:not(.is-active):hover .home-market-tag-text {
  color: #64748b;
}

.home-market-tag-entry:not(.is-active):hover {
  background: #eef2f7;
}

.home-market-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 12px;
  animation: home-content-switch-in 240ms cubic-bezier(0.22, 1, 0.36, 1);
}

.home-market-card-entry {
  min-width: 0;
  min-height: 44px;
}

.home-market-card-visual {
  position: relative;
  margin-bottom: 8px;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  border: 1px solid #eef2f7;
  background: #ffffff;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--aether-shadow-soft, 0 0 24px rgba(15, 23, 42, 0.06));
}

.home-market-card-visual.tone-ink {
  background: #ffffff;
}

.home-market-card-visual.tone-mist {
  background: #ffffff;
}

.home-market-card-visual.tone-aqua {
  background: #ffffff;
}

.home-market-card-visual.tone-sand {
  background: #ffffff;
}

.home-market-card-placeholder-icon {
  color: #cbd5e1;
}

.home-market-card-image {
  width: 100%;
  height: 100%;
}

.home-market-card-badge {
  position: absolute;
  right: 8px;
  top: 8px;
  min-width: 32px;
  height: 20px;
  border-radius: 999px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.home-market-card-badge.tone-new {
  background: #ef4444;
  color: #ffffff;
}

.home-market-card-badge.tone-hot {
  background: #f97316;
  color: #ffffff;
}

.home-market-card-badge.tone-featured {
  background: #22d3ee;
  color: #ffffff;
}

.home-market-card-badge-text {
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.16em;
  font-weight: 900;
  transform: scale(0.75);
  transform-origin: center center;
}

.home-market-card-badge.tone-featured {
  min-width: 40px;
}

.home-market-card-badge.tone-featured .home-market-card-badge-text {
  letter-spacing: 0.06em;
  transform: scale(0.92);
}

.home-market-card-copy {
  padding: 0 4px;
}

.home-market-card-name {
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
  color: #111111;
}

.home-market-card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.home-market-card-id {
  font-size: 12px;
  line-height: 12px;
  color: #9ca3af;
}

.home-market-card-price {
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
  color: #111111;
}

.home-safe-mini-text {
  display: inline-block;
  min-width: 0;
  font-size: 12px;
  line-height: 12px;
  transform-origin: center center;
  vertical-align: top;
}

.home-safe-mini-text-10 {
  transform: scale(0.8333333);
}

.home-safe-mini-text-9 {
  transform: scale(0.75);
}

.home-safe-mini-text-8 {
  transform: scale(0.6666667);
}

.home-banner-live-mini,
.home-banner-id,
.home-featured-id,
.home-market-subtitle,
.home-market-card-id {
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

@keyframes home-content-switch-in {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.988);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media screen and (width < 430px) {
  .home-banner-carousel {
    width: 100%;
  }
}

</style>

