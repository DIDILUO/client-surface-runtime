<template>
  <StandalonePageScaffold route-source="profile-asset-detail-page">
    <template #default="{ canOpenDrawer, openDrawer }">
      <view class="profile-asset-detail-page">
        <scroll-view class="profile-asset-detail-scroll" scroll-y>
          <view class="profile-asset-detail-flow">
            <view class="profile-asset-detail-header">
              <HomeInteractiveTarget
                class="profile-asset-detail-back-entry"
                interaction-mode="compact"
                label="返回上一页"
                @activate="handleBack"
              >
                <ArrowLeft :size="20" :stroke-width="1.9" />
              </HomeInteractiveTarget>

              <view class="profile-asset-detail-header-copy">
                <text class="profile-asset-detail-header-title">资产详情</text>
                <text class="profile-asset-detail-header-subtitle">OWNED DETAIL</text>
              </view>

              <HomeInteractiveTarget
                v-if="canOpenDrawer"
                class="profile-asset-detail-menu-entry"
                interaction-mode="compact"
                label="打开更多服务"
                @activate="openDrawer"
              >
                <Menu :size="20" :stroke-width="1.9" />
              </HomeInteractiveTarget>
              <view v-else class="profile-asset-detail-header-spacer" aria-hidden="true" />
            </view>

            <view class="profile-asset-detail-hero-card">
              <view class="profile-asset-detail-preview">
                <view class="profile-asset-detail-preview-canvas">
                  <component :is="assetIcon" :size="42" :stroke-width="1.35" />
                </view>
                <text class="profile-asset-detail-preview-id">{{ content.id }}</text>
              </view>

              <view class="profile-asset-detail-copy">
                <view class="profile-asset-detail-badge-row">
                  <view class="profile-asset-detail-badge-chip">
                    <text class="profile-asset-detail-badge-chip-text">{{ content.categoryLabel }}</text>
                  </view>
                  <view class="profile-asset-detail-badge-chip tone-cyan">
                    <text class="profile-asset-detail-badge-chip-text">{{ content.statusLabel }}</text>
                  </view>
                </view>

                <text class="profile-asset-detail-title">{{ content.title }}</text>
                <text class="profile-asset-detail-subtitle">{{ content.categoryEnglishLabel }}</text>
                <text class="profile-asset-detail-summary">{{ content.summary }}</text>
              </view>
            </view>

            <view class="profile-asset-detail-meta-card">
              <view class="profile-asset-detail-section-head">
                <text class="profile-asset-detail-section-title">资产信息</text>
                <text class="profile-asset-detail-section-subtitle">META</text>
              </view>

              <view class="profile-asset-detail-meta-grid">
                <view class="profile-asset-detail-meta-item">
                  <text class="profile-asset-detail-meta-label">一级分区</text>
                  <text class="profile-asset-detail-meta-value">{{ content.categoryLabel }}</text>
                </view>
                <view class="profile-asset-detail-meta-item">
                  <text class="profile-asset-detail-meta-label">二级标签</text>
                  <text class="profile-asset-detail-meta-value">{{ content.subCategory }}</text>
                </view>
                <view class="profile-asset-detail-meta-item">
                  <text class="profile-asset-detail-meta-label">入库时间</text>
                  <text class="profile-asset-detail-meta-value">{{ content.acquiredAt }}</text>
                </view>
                <view class="profile-asset-detail-meta-item">
                  <text class="profile-asset-detail-meta-label">状态</text>
                  <text class="profile-asset-detail-meta-value">{{ content.statusLabel }}</text>
                </view>
              </view>
            </view>

            <view class="profile-asset-detail-note-card">
              <view class="profile-asset-detail-section-head">
                <text class="profile-asset-detail-section-title">说明</text>
                <text class="profile-asset-detail-section-subtitle">DETAIL</text>
              </view>

              <view class="profile-asset-detail-note-list">
                <view class="profile-asset-detail-note-item">
                  <view class="profile-asset-detail-note-dot" />
                  <text class="profile-asset-detail-note-text">当前详情页已经脱离 updating 泛占位，后续只需要把资源字段替换成真实后台返回。</text>
                </view>
                <view class="profile-asset-detail-note-item">
                  <view class="profile-asset-detail-note-dot" />
                  <text class="profile-asset-detail-note-text">资产详情继续按 `resourceType + resourceId` 取数，不会因为资产数量增加而再长成一资源一页面。</text>
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
import { computed, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { ArrowLeft, Box, Menu, Package, Shield } from 'lucide-vue-next'
import type { Component } from 'vue'
import StandalonePageScaffold from '../../components/StandalonePageScaffold.vue'
import type { ProfileCategoryKey } from '../../models/homeRailProfile.model'
import type { ProfileAssetDetailContent } from '../../models/profileAssetDetail.model'
import { createProfileAssetDetailShell, resolveProfileAssetDetailContent } from '../../services/profileAssetDetailContent.service'
import { parseProfileAssetDetailRouteQuery } from '../../services/routeQuery.service'
import HomeInteractiveTarget from '../home/components/HomeInteractiveTarget.vue'

const content = reactive<ProfileAssetDetailContent>(createProfileAssetDetailShell('M-01'))

const assetIcon = computed<Component>(() => {
  if (content.categoryId === 'blindBoxes') {
    return Package
  }

  if (content.categoryId === 'certificates') {
    return Shield
  }

  return Box
})

const applyContent = (nextContent: ProfileAssetDetailContent) => {
  Object.assign(content, nextContent)
}

onLoad((query) => {
  const routeQuery = parseProfileAssetDetailRouteQuery(query as Record<string, unknown>)
  const fallbackCategory = (routeQuery.category || 'collections') as ProfileCategoryKey
  applyContent(createProfileAssetDetailShell(routeQuery.assetId || 'M-01', fallbackCategory))

  if (!routeQuery.assetId) {
    return
  }

  void resolveProfileAssetDetailContent(routeQuery.assetId, fallbackCategory)
    .then((nextContent) => {
      applyContent(nextContent)
    })
    .catch((error) => {
      console.error('[profile-asset-detail] failed to hydrate asset detail', error)
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
.profile-asset-detail-page {
  width: 100%;
  min-height: 100dvh;
  background:
    radial-gradient(circle at top right, rgba(34, 211, 238, 0.08), transparent 36%),
    linear-gradient(180deg, #fafafa 0%, #f4f5f7 100%);
}

.profile-asset-detail-scroll {
  height: 100dvh;
}

.profile-asset-detail-flow {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100%;
  padding: 16px 16px 32px;
  box-sizing: border-box;
}

.profile-asset-detail-header {
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
}

.profile-asset-detail-back-entry,
.profile-asset-detail-menu-entry,
.profile-asset-detail-header-spacer {
  width: 44px;
  height: 44px;
}

.profile-asset-detail-back-entry,
.profile-asset-detail-menu-entry {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111827;
}

.profile-asset-detail-header-copy {
  min-width: 0;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
}

.profile-asset-detail-header-title {
  color: #111111;
  font-size: 20px;
  line-height: 28px;
  font-weight: 900;
}

.profile-asset-detail-header-subtitle {
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

.profile-asset-detail-hero-card,
.profile-asset-detail-meta-card,
.profile-asset-detail-note-card {
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 0 24px rgba(15, 23, 42, 0.05);
}

.profile-asset-detail-hero-card {
  display: grid;
  grid-template-columns: 128px minmax(0, 1fr);
  gap: 16px;
  padding: 20px;
}

.profile-asset-detail-preview {
  position: relative;
  width: 128px;
  height: 128px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid #eef2f7;
  box-shadow: 0 0 18px rgba(15, 23, 42, 0.04);
  overflow: hidden;
}

.profile-asset-detail-preview-canvas {
  position: absolute;
  inset: 16px;
  border-radius: 18px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 252, 0.92) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
}

.profile-asset-detail-preview-id {
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

.profile-asset-detail-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profile-asset-detail-badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.profile-asset-detail-badge-chip {
  min-height: 24px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background: #f4f5f7;
  color: #64748b;
}

.profile-asset-detail-badge-chip.tone-cyan {
  background: rgba(236, 254, 255, 0.98);
  color: #0891b2;
}

.profile-asset-detail-badge-chip-text {
  font-size: 12px;
  line-height: 12px;
  font-weight: 700;
}

.profile-asset-detail-title {
  color: #111111;
  font-size: 24px;
  line-height: 28px;
  font-weight: 900;
}

.profile-asset-detail-subtitle {
  color: #22d3ee;
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.profile-asset-detail-summary {
  color: #64748b;
  font-size: 14px;
  line-height: 24px;
}

.profile-asset-detail-meta-card,
.profile-asset-detail-note-card {
  padding: 20px;
}

.profile-asset-detail-section-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.profile-asset-detail-section-title {
  color: #111111;
  font-size: 20px;
  line-height: 24px;
  font-weight: 900;
}

.profile-asset-detail-section-subtitle {
  color: #22d3ee;
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  letter-spacing: 0.14em;
  transform: scale(0.75);
  transform-origin: left bottom;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.profile-asset-detail-meta-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.profile-asset-detail-meta-item {
  min-width: 0;
  padding: 16px;
  border-radius: 18px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.profile-asset-detail-meta-label {
  color: #94a3b8;
  font-size: 12px;
  line-height: 16px;
}

.profile-asset-detail-meta-value {
  color: #111111;
  font-size: 16px;
  line-height: 20px;
  font-weight: 800;
}

.profile-asset-detail-note-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profile-asset-detail-note-item {
  display: grid;
  grid-template-columns: 8px 1fr;
  gap: 8px;
  align-items: start;
}

.profile-asset-detail-note-dot {
  width: 6px;
  height: 6px;
  margin-top: 9px;
  border-radius: 999px;
  background: #22d3ee;
}

.profile-asset-detail-note-text {
  color: #475569;
  font-size: 14px;
  line-height: 24px;
}
</style>

