<template>
  <view class="home-profile-panel">
    <view class="home-profile-header">
      <view class="home-profile-header-title-group">
        <text class="home-profile-header-title">个人中心</text>
        <text class="home-profile-header-subtitle">USER_SYNC</text>
      </view>

      <view class="home-profile-header-actions">
        <HomeInteractiveTarget
          class="home-profile-header-action"
          interaction-mode="compact"
          label="打开官方社群"
          @activate="handleOpenCommunity"
        >
          <Users :size="18" :stroke-width="1.8" />
        </HomeInteractiveTarget>
        <HomeInteractiveTarget
          class="home-profile-header-action"
          interaction-mode="compact"
          label="打开系统设置"
          @activate="handleOpenSettings"
        >
          <Settings :size="18" :stroke-width="1.8" />
        </HomeInteractiveTarget>
      </view>
    </view>

    <view class="home-profile-identity-card">
      <view class="home-profile-identity-main">
        <view class="home-profile-avatar-wrap">
          <view class="home-profile-avatar-core">
            <User :size="18" :stroke-width="1.9" />
          </view>
          <view class="home-profile-avatar-dot" />
        </view>

        <view class="home-profile-identity-copy">
          <text class="home-profile-identity-name">{{ content.summary.displayName }}</text>

          <view class="home-profile-address-row">
            <view class="home-profile-address-chip">
              <text class="home-profile-address-text">{{ content.summary.address }}</text>
            </view>

            <HomeInteractiveTarget
              class="home-profile-inline-action"
              interaction-mode="compact"
              label="复制钱包地址"
              @activate="handleCopyAddress"
            >
              <Copy :size="16" :stroke-width="1.8" />
            </HomeInteractiveTarget>
          </view>
        </view>
      </view>

      <HomeInteractiveTarget
        class="home-profile-qr-entry"
        interaction-mode="compact"
        label="查看地址二维码"
        @activate="handleShowQr"
      >
        <QrCode :size="18" :stroke-width="1.8" />
      </HomeInteractiveTarget>
    </view>

    <view class="home-profile-summary-grid">
      <HomeInteractiveTarget class="home-profile-summary-card tone-light" label="查看资产总额汇总" @activate="handleSummaryFocus">
        <view class="home-profile-summary-copy">
          <view class="home-profile-summary-head">
            <text class="home-profile-summary-title">资产总额</text>
            <text class="home-profile-summary-subtitle">TOTAL VALUE</text>
          </view>

          <view class="home-profile-summary-value-row">
            <text class="home-profile-summary-unit">¥</text>
            <text class="home-profile-summary-main">{{ content.summary.totalValue }}</text>
          </view>
        </view>
      </HomeInteractiveTarget>

      <HomeInteractiveTarget class="home-profile-summary-card tone-dark" label="查看持有藏品汇总" @activate="handleSummaryFocus">
        <view class="home-profile-summary-copy">
          <view class="home-profile-summary-head">
            <text class="home-profile-summary-title is-light">持有藏品</text>
            <text class="home-profile-summary-subtitle is-light">HOLDINGS</text>
          </view>

          <view class="home-profile-summary-value-row">
            <text class="home-profile-summary-main is-light">{{ content.summary.holdings }}</text>
            <text class="home-profile-summary-unit is-meta">件</text>
          </view>
        </view>
      </HomeInteractiveTarget>
    </view>

    <view class="home-profile-quick-card">
      <HomeInteractiveTarget
        v-for="entry in profileQuickActions"
        :key="entry.id"
        class="home-profile-quick-entry"
        interaction-mode="compact"
        :label="entry.label"
        @activate="handleQuickEntryClick(entry.routeUrl)"
      >
        <view class="home-profile-quick-indicator" :class="`tone-${entry.indicator?.tone ?? 'cyan'}`" v-if="entry.indicator?.visible" />
        <view class="home-profile-quick-icon">
          <component :is="resolveHomeShellIconComponent(entry.iconKey)" :size="18" :stroke-width="1.8" />
        </view>
        <text class="home-profile-quick-label">{{ entry.label }}</text>
      </HomeInteractiveTarget>
    </view>

    <view class="home-profile-assets-stack" :class="{ 'is-highlighted': isAssetSectionHighlighted }">
      <view class="home-profile-assets-head">
        <view class="home-profile-assets-title-group">
          <text class="home-profile-assets-title">我的藏品</text>
          <text class="home-profile-assets-subtitle">ASSETS</text>
        </view>

        <HomeInteractiveTarget
          class="home-profile-search-entry"
          interaction-mode="compact"
          label="搜索我的藏品"
          @activate="handleSearchAssets"
        >
          <Search :size="18" :stroke-width="1.8" />
        </HomeInteractiveTarget>
      </view>

      <view class="home-profile-category-wrap">
        <scroll-view class="home-profile-category-scroll" scroll-x :show-scrollbar="false">
          <view class="home-profile-category-track">
            <HomeInteractiveTarget
              v-for="category in content.categories"
              :key="category.id"
              class="home-profile-category-entry"
              interaction-mode="compact"
              :selected="activeCategory === category.id"
              :class="{ 'is-active': activeCategory === category.id }"
              :label="`切换到 ${category.label}`"
              @activate="handleCategoryChange(category.id)"
            >
              <text class="home-profile-category-text">{{ category.label }}</text>
            </HomeInteractiveTarget>
          </view>
        </scroll-view>
        <view class="home-profile-category-fade-right" />
      </view>

      <view class="home-profile-subcategory-wrap">
        <scroll-view class="home-profile-subcategory-scroll" scroll-x :show-scrollbar="false">
          <view class="home-profile-subcategory-track">
            <HomeInteractiveTarget
              v-for="subCategory in content.subCategories"
              :key="subCategory"
              class="home-profile-subcategory-entry"
              interaction-mode="compact"
              :selected="activeSubCategory === subCategory"
              :label="`筛选 ${subCategory}`"
              @activate="handleSubCategoryChange(subCategory)"
            >
              <text class="home-profile-subcategory-text" :class="{ 'is-active': activeSubCategory === subCategory }">{{ subCategory }}</text>
              <view class="home-profile-subcategory-line" :class="{ 'is-active': activeSubCategory === subCategory }" />
            </HomeInteractiveTarget>
          </view>
        </scroll-view>
        <view class="home-profile-subcategory-fade-right" />
      </view>

      <view v-if="visibleAssets.length" class="home-profile-asset-grid">
        <HomeInteractiveTarget
          v-for="item in visibleAssets"
          :key="item.id"
          class="home-profile-asset-entry"
          :label="`查看 ${item.name}`"
          @activate="handleAssetClick(item)"
        >
          <view class="home-profile-asset-visual">
            <view class="home-profile-asset-type">{{ item.subCategory }}</view>
            <view class="home-profile-asset-canvas" />
            <text class="home-profile-asset-id-corner">{{ item.id }}</text>
          </view>

          <view class="home-profile-asset-copy">
            <text class="home-profile-asset-name">{{ item.name }}</text>
            <view class="home-profile-asset-meta">
              <text class="home-profile-asset-id">{{ item.id }}</text>
              <text class="home-profile-asset-date">{{ item.date }}</text>
            </view>
          </view>
        </HomeInteractiveTarget>
      </view>

      <view v-else class="home-profile-empty-card">
        <Box :size="28" :stroke-width="1.2" />
        <text class="home-profile-empty-title">暂无对应资产</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Box, Copy, QrCode, Search, Settings, User, Users } from 'lucide-vue-next'
import HomeInteractiveTarget from './HomeInteractiveTarget.vue'
import { createHomeRailProfileContentShell, resolveHomeRailProfileContent } from '../../../services/homeRailProfileContent.service'
import { ensureHomeShellMenuReminderHydrated, useResolvedHomeShellDrawerEntries } from '../../../services/homeShellMenuState.service'
import {
  buildHomeServiceEntryUrl,
  buildProfileAddressQrUrl,
  buildProfileAssetDetailUrl,
  buildProfileAssetSearchUrl,
  buildProfileSettingsUrl,
} from '../../../services/homeRailNavigation.service'
import type { HomeShellDrawerEntry } from '../../../models/homeShellMenu.model'
import type { HomeRailProfileContent, ProfileAssetItem, ProfileCategoryKey } from '../../../models/homeRailProfile.model'
import { resolveHomeShellIconComponent } from '../../../utils/homeShellIconMap'

const content = ref<HomeRailProfileContent>(createHomeRailProfileContentShell())
const activeCategory = ref<ProfileCategoryKey>(content.value.categories[0]?.id ?? 'collections')
const activeSubCategory = ref(content.value.subCategories[0] ?? '全部')
const isAssetSectionHighlighted = ref(false)
let highlightTimer: ReturnType<typeof setTimeout> | null = null
const drawerEntries = useResolvedHomeShellDrawerEntries('profile-quick-action')

const syncProfileFilters = () => {
  const categories = content.value.categories
  const subCategories = content.value.subCategories

  if (!categories.some((item) => item.id === activeCategory.value)) {
    activeCategory.value = categories[0]?.id ?? 'collections'
  }

  if (!subCategories.includes(activeSubCategory.value)) {
    activeSubCategory.value = subCategories[0] ?? '全部'
  }
}

const profileQuickActions = computed<HomeShellDrawerEntry[]>(() => {
  return drawerEntries.value.filter((entry) => entry.id !== 'community' && entry.id !== 'settings')
})

const currentCategoryAssets = computed(() => {
  return content.value.assets[activeCategory.value] ?? []
})

const visibleAssets = computed(() => {
  if (activeSubCategory.value === '全部') {
    return currentCategoryAssets.value
  }

  return currentCategoryAssets.value.filter((item) => item.subCategory === activeSubCategory.value)
})

const safeNavigate = (url: string) => {
  uni.navigateTo({ url })
}

const triggerAssetSectionHighlight = () => {
  isAssetSectionHighlighted.value = true
  if (highlightTimer) {
    clearTimeout(highlightTimer)
  }
  highlightTimer = setTimeout(() => {
    isAssetSectionHighlighted.value = false
  }, 720)
}

const handleOpenCommunity = () => {
  safeNavigate(buildHomeServiceEntryUrl('community', 'profile-header-community'))
}

const handleOpenSettings = () => {
  safeNavigate(buildProfileSettingsUrl())
}

const handleCopyAddress = () => {
  uni.setClipboardData({
    data: content.value.summary.address,
  })
}

const handleShowQr = () => {
  safeNavigate(buildProfileAddressQrUrl())
}

const handleQuickEntryClick = (url: string) => {
  safeNavigate(url)
}

const handleSearchAssets = () => {
  safeNavigate(buildProfileAssetSearchUrl())
}

const handleCategoryChange = (categoryId: ProfileCategoryKey) => {
  activeCategory.value = categoryId
  activeSubCategory.value = '全部'
  triggerAssetSectionHighlight()
}

const handleSubCategoryChange = (subCategory: string) => {
  activeSubCategory.value = subCategory
  triggerAssetSectionHighlight()
}

const handleSummaryFocus = () => {
  activeCategory.value = 'collections'
  activeSubCategory.value = '全部'
  triggerAssetSectionHighlight()
}

const handleAssetClick = (item: ProfileAssetItem) => {
  safeNavigate(buildProfileAssetDetailUrl(item.id, activeCategory.value, item.name))
}

onMounted(async () => {
  void ensureHomeShellMenuReminderHydrated().catch((error) => {
    console.error('[homeRail] failed to hydrate service reminders', error)
  })

  try {
    content.value = await resolveHomeRailProfileContent()
  } catch (error) {
    console.error('[homeRail] failed to resolve profile scene content', error)
    content.value = createHomeRailProfileContentShell()
  } finally {
    syncProfileFilters()
  }
})

onBeforeUnmount(() => {
  if (highlightTimer) {
    clearTimeout(highlightTimer)
  }
})
</script>
<style lang="scss" scoped>
.home-profile-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0 var(--home-page-inline-padding, 16px);
  box-sizing: border-box;
  background: #fafafa;
}

.home-profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.home-profile-header-title-group,
.home-profile-assets-title-group {
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.home-profile-header-title,
.home-profile-assets-title {
  font-size: 20px;
  line-height: 24px;
  font-weight: 900;
  color: #111111;
}

.home-profile-header-subtitle,
.home-profile-assets-subtitle {
  min-height: 12px;
  display: inline-block;
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  color: #22d3ee;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  transform: scale(0.75);
  transform-origin: left bottom;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.home-profile-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.home-profile-header-action,
.home-profile-inline-action,
.home-profile-qr-entry,
.home-profile-search-entry {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.home-profile-identity-card {
  position: relative;
  border-radius: 24px;
  border: 1px solid #eef2f7;
  background:
    radial-gradient(circle at 100% 0%, rgba(34, 211, 238, 0.14), transparent 34%),
    linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: var(--aether-shadow-soft, 0 0 24px rgba(15, 23, 42, 0.06));
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.home-profile-identity-main {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  gap: 12px;
}

.home-profile-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.home-profile-avatar-core {
  width: 52px;
  height: 52px;
  border-radius: 999px;
  background: #111111;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 18px rgba(17, 17, 17, 0.12);
}

.home-profile-avatar-dot {
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  border: 2px solid #ffffff;
  background: #22d3ee;
}

.home-profile-identity-copy {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.home-profile-identity-name {
  font-size: 16px;
  line-height: 20px;
  font-weight: 900;
  color: #111111;
}

.home-profile-address-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.home-profile-address-chip {
  min-width: 0;
  max-width: 168px;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 10px;
  background: #f4f5f7;
  display: inline-flex;
  align-items: center;
}

.home-profile-address-text {
  min-width: 0;
  font-size: 12px;
  line-height: 12px;
  color: #6b7280;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.home-profile-qr-entry {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: var(--aether-shadow-soft-xs, 0 0 16px rgba(15, 23, 42, 0.04));
  flex-shrink: 0;
}

.home-profile-summary-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 12px;
}

.home-profile-summary-card {
  min-height: 96px;
  border-radius: 20px;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
}

.home-profile-summary-card.tone-light {
  background:
    radial-gradient(circle at 92% 8%, rgba(34, 211, 238, 0.12), transparent 28%),
    linear-gradient(180deg, #ffffff 0%, #f4f5f7 100%);
  border: 1px solid #eef2f7;
  box-shadow: var(--aether-shadow-soft, 0 0 24px rgba(15, 23, 42, 0.06));
}

.home-profile-summary-card.tone-dark {
  background:
    radial-gradient(circle at 102% 102%, rgba(34, 211, 238, 0.3), transparent 44%),
    linear-gradient(180deg, #111111 0%, #111827 100%);
  box-shadow: var(--aether-shadow-soft, 0 0 24px rgba(15, 23, 42, 0.06));
}

.home-profile-summary-copy {
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
}

.home-profile-summary-head {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.home-profile-summary-title {
  font-size: 12px;
  line-height: 16px;
  font-weight: 800;
  color: #111111;
}

.home-profile-summary-title.is-light {
  color: #ffffff;
}

.home-profile-summary-subtitle {
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  color: #22d3ee;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  transform: scale(0.75);
  transform-origin: left center;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.home-profile-summary-subtitle.is-light {
  color: rgba(34, 211, 238, 0.92);
}

.home-profile-summary-value-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.home-profile-summary-unit {
  font-size: 12px;
  line-height: 16px;
  font-weight: 800;
  color: #111111;
}

.home-profile-summary-unit.is-meta {
  color: rgba(226, 232, 240, 0.72);
}

.home-profile-summary-main {
  font-size: 24px;
  line-height: 24px;
  font-weight: 900;
  color: #111111;
}

.home-profile-summary-main.is-light {
  color: #ffffff;
}

.home-profile-quick-card {
  border-radius: 24px;
  border: 1px solid #eef2f7;
  background: #ffffff;
  box-shadow: var(--aether-shadow-soft, 0 0 24px rgba(15, 23, 42, 0.06));
  padding: 10px 8px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 4px;
}

.home-profile-quick-entry {
  position: relative;
  min-height: 64px;
  padding: 8px 4px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.home-profile-quick-indicator {
  position: absolute;
  top: 8px;
  right: 12px;
  width: 6px;
  height: 6px;
  border-radius: 999px;
}

.home-profile-quick-indicator.tone-cyan { background: #22d3ee; }
.home-profile-quick-indicator.tone-green { background: #34d399; }
.home-profile-quick-indicator.tone-amber { background: #f59e0b; }
.home-profile-quick-indicator.tone-rose { background: #f43f5e; }
.home-profile-quick-indicator.tone-red { background: #ef4444; }

.home-profile-quick-icon {
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-profile-quick-label {
  font-size: 11px;
  line-height: 14px;
  font-weight: 700;
  color: #6b7280;
  text-align: center;
}

.home-profile-assets-stack {
  border-radius: 28px;
  transition: background-color 220ms ease, box-shadow 220ms ease;
}

.home-profile-assets-stack.is-highlighted {
  background: rgba(34, 211, 238, 0.05);
  box-shadow: inset 0 0 0 1px rgba(34, 211, 238, 0.08);
}

.home-profile-assets-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}

.home-profile-category-wrap,
.home-profile-subcategory-wrap {
  position: relative;
}

.home-profile-category-scroll,
.home-profile-subcategory-scroll {
  width: 100%;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.home-profile-category-scroll::-webkit-scrollbar,
.home-profile-subcategory-scroll::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.home-profile-category-track {
  display: flex;
  align-items: center;
  gap: 8px;
  width: max-content;
  padding-right: 24px;
  box-sizing: border-box;
}

.home-profile-category-entry {
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: #f4f5f7;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.home-profile-category-entry.is-active {
  background: #111111;
}

.home-profile-category-text {
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
  color: #9ca3af;
}

.home-profile-category-entry.is-active .home-profile-category-text {
  color: #ffffff;
}

.home-profile-category-fade-right,
.home-profile-subcategory-fade-right {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 24px;
  pointer-events: none;
  background: linear-gradient(270deg, #fafafa 0%, rgba(250, 250, 250, 0) 100%);
}

.home-profile-subcategory-track {
  display: flex;
  align-items: center;
  gap: 16px;
  width: max-content;
  padding: 0 24px 2px 0;
  box-sizing: border-box;
  border-bottom: 1px solid #e5e7eb;
}

.home-profile-subcategory-entry {
  position: relative;
  min-height: 28px;
  display: inline-flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0 0 6px;
}

.home-profile-subcategory-text {
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
  color: #9ca3af;
}

.home-profile-subcategory-text.is-active {
  color: #111111;
}

.home-profile-subcategory-line {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  border-radius: 999px;
  background: transparent;
  transition: background-color 180ms ease;
}

.home-profile-subcategory-line.is-active {
  background: #111111;
}

.home-profile-asset-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 12px;
}

.home-profile-asset-entry {
  display: block;
}

.home-profile-asset-visual {
  position: relative;
  margin-bottom: 8px;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 14px;
  border: 1px solid #eef2f7;
  background: #ffffff;
  box-shadow: var(--aether-shadow-soft, 0 0 24px rgba(15, 23, 42, 0.06));
  overflow: hidden;
}

.home-profile-asset-type {
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 12px;
  line-height: 12px;
  color: #cbd5e1;
  transform: scale(0.75);
  transform-origin: left top;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.home-profile-asset-canvas {
  position: absolute;
  inset: 18px;
  border-radius: 18px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  background:
    radial-gradient(circle at 84% 84%, rgba(34, 211, 238, 0.08), transparent 22%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 252, 0.92) 100%);
}

.home-profile-asset-id-corner {
  position: absolute;
  right: 12px;
  bottom: 12px;
  font-size: 12px;
  line-height: 12px;
  color: #cbd5e1;
  transform: scale(0.75);
  transform-origin: right bottom;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.home-profile-asset-copy {
  padding: 0 4px;
}

.home-profile-asset-name {
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
  color: #111111;
}

.home-profile-asset-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.home-profile-asset-id,
.home-profile-asset-date {
  font-size: 12px;
  line-height: 12px;
  color: #9ca3af;
}

.home-profile-asset-id {
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.home-profile-empty-card {
  margin-top: 16px;
  min-height: 136px;
  border-radius: 20px;
  border: 1px solid #eef2f7;
  background: #ffffff;
  box-shadow: var(--aether-shadow-soft, 0 0 24px rgba(15, 23, 42, 0.06));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #cbd5e1;
}

.home-profile-empty-title {
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
  color: #9ca3af;
}
</style>

