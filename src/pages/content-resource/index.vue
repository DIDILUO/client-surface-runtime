<template>
  <StandalonePageScaffold route-source="content-resource-page">
    <template #default="{ canOpenDrawer, openDrawer }">
      <view class="content-resource-page">
        <scroll-view class="content-resource-scroll" scroll-y>
          <view class="content-resource-flow">
            <view class="content-resource-header">
              <HomeInteractiveTarget
                class="content-resource-back-entry"
                interaction-mode="compact"
                label="返回上一页"
                @activate="handleBack"
              >
                <ArrowLeft :size="20" :stroke-width="1.9" />
              </HomeInteractiveTarget>

              <view class="content-resource-header-copy">
                <text class="content-resource-header-title">{{ headerTitle }}</text>
                <text class="content-resource-header-subtitle">{{ content.englishTitle }}</text>
              </view>

              <HomeInteractiveTarget
                v-if="canOpenDrawer"
                class="content-resource-menu-entry"
                interaction-mode="compact"
                label="打开更多服务"
                @activate="openDrawer"
              >
                <Menu :size="20" :stroke-width="1.9" />
              </HomeInteractiveTarget>
              <view v-else class="content-resource-header-spacer" aria-hidden="true" />
            </view>

            <view class="content-resource-hero-card" :class="`tone-${content.visualTone}`">
              <view class="content-resource-preview">
                <image v-if="content.imageUrl" class="content-resource-preview-image" :src="content.imageUrl" mode="aspectFill" />
                <view v-else class="content-resource-preview-canvas">
                  <component :is="resolvedIcon" :size="44" :stroke-width="1.28" />
                </view>
                <text class="content-resource-preview-id">{{ content.resourceId }}</text>
              </view>

              <view class="content-resource-copy">
                <view class="content-resource-badge-row">
                  <view
                    v-for="badge in content.badges"
                    :key="badge.id"
                    class="content-resource-badge-chip"
                    :class="`tone-${badge.tone}`"
                  >
                    <text class="content-resource-badge-chip-text">{{ badge.label }}</text>
                  </view>
                </view>

                <text class="content-resource-title">{{ content.title }}</text>
                <text class="content-resource-subtitle">{{ content.subtitle }}</text>
                <text class="content-resource-summary">{{ content.summary }}</text>
              </view>
            </view>

            <view class="content-resource-price-card">
              <view class="content-resource-section-head">
                <text class="content-resource-section-title">核心信息</text>
                <text class="content-resource-section-subtitle">CORE</text>
              </view>

              <view class="content-resource-price-row">
                <text class="content-resource-price-label">{{ content.priceLabel }}</text>
                <view class="content-resource-price-value">
                  <text v-if="content.priceUnit" class="content-resource-price-unit">{{ content.priceUnit }}</text>
                  <text class="content-resource-price-main">{{ content.priceValue }}</text>
                </view>
              </view>

              <view class="content-resource-progress-meta">
                <text class="content-resource-progress-label">{{ content.progressLabel }}</text>
                <text class="content-resource-progress-status">{{ content.statusLabel }}</text>
              </view>

              <view class="content-resource-progress-track">
                <view class="content-resource-progress-fill" :style="progressStyle" />
              </view>
            </view>

            <view class="content-resource-meta-card">
              <view class="content-resource-section-head">
                <text class="content-resource-section-title">资源信息</text>
                <text class="content-resource-section-subtitle">META</text>
              </view>

              <view class="content-resource-meta-grid">
                <view v-for="stat in content.stats" :key="stat.id" class="content-resource-meta-item">
                  <text class="content-resource-meta-label">{{ stat.label }}</text>
                  <view class="content-resource-meta-value-row">
                    <text class="content-resource-meta-value">{{ stat.value }}</text>
                    <text v-if="stat.caption" class="content-resource-meta-caption">{{ stat.caption }}</text>
                  </view>
                </view>
              </view>
            </view>

            <view class="content-resource-note-card">
              <view class="content-resource-section-head">
                <text class="content-resource-section-title">链路说明</text>
                <text class="content-resource-section-subtitle">PIPELINE</text>
              </view>

              <view class="content-resource-note-item">
                <view class="content-resource-note-dot" />
                <text class="content-resource-note-text">{{ content.relationNote }}</text>
              </view>
              <view class="content-resource-note-item">
                <view class="content-resource-note-dot" />
                <text class="content-resource-note-text">当前页面已经脱离 `updating` 泛占位，后续只需要让后端继续返回同一资源 ID 的详情即可。</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </template>
  </StandalonePageScaffold>
</template>

<script setup lang="ts">
import { computed, reactive, type Component } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { Aperture, ArrowLeft, Box, Cpu, Disc3, Hexagon, Menu, Triangle } from 'lucide-vue-next'
import StandalonePageScaffold from '../../components/StandalonePageScaffold.vue'
import type { ContentPlaceholderIconKey } from '../../contracts/content-api.contract'
import type { ContentResourceDetailContent } from '../../models/contentResourceDetail.model'
import { createContentResourceDetailShell, resolveContentResourceDetail } from '../../services/contentResourceDetail.service'
import { parseContentResourceRouteQuery } from '../../services/routeQuery.service'
import HomeInteractiveTarget from '../home/components/HomeInteractiveTarget.vue'

type SupportedResourceType = 'home_banner' | 'activity' | 'drop' | 'market_item'

const content = reactive<ContentResourceDetailContent>(createContentResourceDetailShell('home_banner', 'AX-99'))

const placeholderIconMap: Record<ContentPlaceholderIconKey, Component> = {
  box: Box,
  cpu: Cpu,
  aperture: Aperture,
  hexagon: Hexagon,
  triangle: Triangle,
  disc3: Disc3,
}

const resolvedIcon = computed<Component>(() => {
  return placeholderIconMap[content.placeholderIconKey] ?? Box
})

const headerTitle = computed(() => {
  if (content.resourceType === 'home_banner') {
    return '首页主视觉详情'
  }

  if (content.resourceType === 'activity') {
    return '活动详情'
  }

  return content.resourceType === 'drop' ? '首发藏品详情' : '藏品市场详情'
})

const progressStyle = computed(() => ({
  width: `${Math.min(100, Math.max(0, content.progressRate)).toFixed(1)}%`,
}))

const applyContent = (nextContent: ContentResourceDetailContent) => {
  Object.assign(content, nextContent)
}

const normalizeResourceType = (value: string): SupportedResourceType => {
  if (value === 'home_banner') {
    return 'home_banner'
  }

  if (value === 'activity') {
    return 'activity'
  }

  return value === 'market_item' ? 'market_item' : 'drop'
}

onLoad((query) => {
  const routeQuery = parseContentResourceRouteQuery(query as Record<string, unknown>)
  const resourceType = normalizeResourceType(routeQuery.resourceType)
  const resourceId = routeQuery.resourceId || (resourceType === 'market_item' ? 'C-01' : resourceType === 'activity' ? 'asset-merge' : 'AX-99')

  applyContent(createContentResourceDetailShell(resourceType, resourceId))

  void resolveContentResourceDetail(resourceType, resourceId)
    .then((nextContent) => {
      applyContent(nextContent)
    })
    .catch((error) => {
      console.error('[content-resource] failed to hydrate resource detail', error)
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
.content-resource-page {
  width: 100%;
  min-height: 100dvh;
  background:
    radial-gradient(circle at top right, rgba(34, 211, 238, 0.08), transparent 36%),
    linear-gradient(180deg, #fafafa 0%, #f4f5f7 100%);
}

.content-resource-scroll {
  height: 100dvh;
}

.content-resource-flow {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100%;
  padding: 16px 16px 32px;
  box-sizing: border-box;
}

.content-resource-header {
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
}

.content-resource-back-entry,
.content-resource-menu-entry,
.content-resource-header-spacer {
  width: 44px;
  height: 44px;
}

.content-resource-back-entry,
.content-resource-menu-entry {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111827;
}

.content-resource-header-copy {
  min-width: 0;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
}

.content-resource-header-title {
  color: #111111;
  font-size: 20px;
  line-height: 28px;
  font-weight: 900;
}

.content-resource-header-subtitle {
  color: #22d3ee;
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transform: scale(0.75);
  transform-origin: left bottom;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.content-resource-hero-card,
.content-resource-price-card,
.content-resource-meta-card,
.content-resource-note-card {
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 0 24px rgba(15, 23, 42, 0.05);
}

.content-resource-hero-card {
  display: grid;
  grid-template-columns: 128px minmax(0, 1fr);
  gap: 16px;
  padding: 20px;
}

.content-resource-preview {
  position: relative;
  width: 128px;
  height: 128px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #eef2f7;
  background: #ffffff;
  box-shadow: 0 0 18px rgba(15, 23, 42, 0.04);
}

.content-resource-preview-image {
  width: 100%;
  height: 100%;
  display: block;
}

.content-resource-preview-canvas {
  position: absolute;
  inset: 16px;
  border-radius: 18px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 250, 252, 0.92) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
}

.content-resource-preview-id {
  position: absolute;
  right: 12px;
  bottom: 12px;
  color: #cbd5e1;
  font-size: 12px;
  line-height: 12px;
  transform: scale(0.75);
  transform-origin: right bottom;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.content-resource-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.content-resource-badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.content-resource-badge-chip {
  min-height: 24px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background: #f4f5f7;
  color: #64748b;
}

.content-resource-badge-chip.tone-cyan {
  background: rgba(236, 254, 255, 0.98);
  color: #0891b2;
}

.content-resource-badge-chip.tone-amber {
  background: rgba(255, 247, 237, 0.98);
  color: #f97316;
}

.content-resource-badge-chip.tone-rose {
  background: rgba(255, 241, 242, 0.98);
  color: #ef4444;
}

.content-resource-badge-chip-text {
  font-size: 12px;
  line-height: 12px;
  font-weight: 700;
}

.content-resource-title {
  color: #111111;
  font-size: 28px;
  line-height: 36px;
  font-weight: 900;
}

.content-resource-subtitle {
  color: #22d3ee;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.content-resource-summary {
  color: #64748b;
  font-size: 14px;
  line-height: 22px;
}

.content-resource-price-card,
.content-resource-meta-card,
.content-resource-note-card {
  padding: 20px;
}

.content-resource-section-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 16px;
}

.content-resource-section-title {
  color: #111111;
  font-size: 18px;
  line-height: 26px;
  font-weight: 800;
}

.content-resource-section-subtitle {
  color: #22d3ee;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transform: scale(0.75);
  transform-origin: left bottom;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.content-resource-price-row,
.content-resource-progress-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.content-resource-price-row {
  margin-bottom: 16px;
}

.content-resource-price-label,
.content-resource-progress-label {
  color: #64748b;
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
}

.content-resource-price-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  color: #111111;
}

.content-resource-price-unit {
  font-size: 14px;
  line-height: 20px;
  font-weight: 800;
}

.content-resource-price-main {
  font-size: 36px;
  line-height: 36px;
  font-weight: 900;
}

.content-resource-progress-status {
  color: #94a3b8;
  font-size: 12px;
  line-height: 12px;
  transform: scale(0.75);
  transform-origin: right center;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.content-resource-progress-track {
  width: 100%;
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: #e2e8f0;
  margin-top: 8px;
}

.content-resource-progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, rgba(34, 211, 238, 0.92) 0%, rgba(56, 189, 248, 0.92) 100%);
}

.content-resource-meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.content-resource-meta-item {
  border-radius: 18px;
  background: rgba(248, 250, 252, 0.92);
  padding: 16px;
}

.content-resource-meta-label {
  color: #94a3b8;
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
}

.content-resource-meta-value-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 10px;
}

.content-resource-meta-value {
  color: #111111;
  font-size: 16px;
  line-height: 22px;
  font-weight: 800;
}

.content-resource-meta-caption {
  color: #94a3b8;
  font-size: 12px;
  line-height: 12px;
  transform: scale(0.75);
  transform-origin: left bottom;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.content-resource-note-card {
  display: flex;
  flex-direction: column;
}

.content-resource-note-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.content-resource-note-item + .content-resource-note-item {
  margin-top: 12px;
}

.content-resource-note-dot {
  width: 8px;
  height: 8px;
  margin-top: 8px;
  border-radius: 999px;
  flex-shrink: 0;
  background: #22d3ee;
}

.content-resource-note-text {
  color: #64748b;
  font-size: 14px;
  line-height: 22px;
}

@media (max-width: 420px) {
  .content-resource-hero-card {
    grid-template-columns: 1fr;
  }

  .content-resource-preview {
    width: 100%;
    aspect-ratio: 1 / 1;
    height: auto;
  }

  .content-resource-title {
    font-size: 24px;
    line-height: 32px;
  }

  .content-resource-price-main {
    font-size: 32px;
    line-height: 32px;
  }
}
</style>

