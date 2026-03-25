<!--
文件版本：v0019
更新时间：2026-03-25 00:34:00
Encoding: UTF-8
本次更新：底部标签栏图标切换为 lucide-vue-next 组件
-->

<template>
  <view class="home-shell-tabbar-wrap" :style="tabbarStyle">
    <view class="home-shell-tabbar-surface">
      <view class="home-shell-tabbar-track">
        <HomeInteractiveTarget
          class="home-shell-tabbar-item"
          :class="{
            'is-active': props.tabActivityFlags.isHomeTabActive,
            'is-fixed': props.isDoubleMode,
            'is-preview': previewTab === HOME_PRIMARY_PAGE_KEY && !props.tabActivityFlags.isHomeTabActive,
          }"
          interaction-mode="compact"
          :hit-width="48"
          :hit-height="48"
          label="首页"
          @mouseenter="handlePreviewEnter(HOME_PRIMARY_PAGE_KEY)"
          @mouseleave="handlePreviewLeave"
          @touchstart="handlePreviewTouchStart(HOME_PRIMARY_PAGE_KEY)"
          @touchend="handlePreviewTouchEnd"
          @touchcancel="handlePreviewTouchEnd"
          @activate="handleChangeTab(HOME_PRIMARY_PAGE_KEY)"
        >
          <view class="home-shell-tabbar-icon-shell" :class="{ 'is-active': props.tabActivityFlags.isHomeTabActive }">
            <view class="home-shell-tabbar-hit">
              <view class="home-shell-tabbar-icon">
                <House class="home-shell-tabbar-icon-svg" :size="24" :stroke-width="1.5" />
              </view>
            </view>
          </view>
        </HomeInteractiveTarget>

        <HomeInteractiveTarget
          class="home-shell-tabbar-item"
          :class="{
            'is-active': props.tabActivityFlags.isActivityTabActive,
            'is-preview': previewTab === HOME_ACTIVITY_PAGE_KEY && !props.tabActivityFlags.isActivityTabActive,
          }"
          interaction-mode="compact"
          :hit-width="48"
          :hit-height="48"
          label="活动"
          @mouseenter="handlePreviewEnter(HOME_ACTIVITY_PAGE_KEY)"
          @mouseleave="handlePreviewLeave"
          @touchstart="handlePreviewTouchStart(HOME_ACTIVITY_PAGE_KEY)"
          @touchend="handlePreviewTouchEnd"
          @touchcancel="handlePreviewTouchEnd"
          @activate="handleChangeTab(HOME_ACTIVITY_PAGE_KEY)"
        >
          <view class="home-shell-tabbar-icon-shell" :class="{ 'is-active': props.tabActivityFlags.isActivityTabActive }">
            <view class="home-shell-tabbar-hit">
              <view class="home-shell-tabbar-icon">
                <Activity class="home-shell-tabbar-icon-svg" :size="24" :stroke-width="1.5" />
              </view>
            </view>
          </view>
        </HomeInteractiveTarget>

        <HomeInteractiveTarget
          class="home-shell-tabbar-item"
          :class="{
            'is-active': props.tabActivityFlags.isProfileTabActive,
            'is-preview': previewTab === HOME_PROFILE_PAGE_KEY && !props.tabActivityFlags.isProfileTabActive,
          }"
          interaction-mode="compact"
          :hit-width="48"
          :hit-height="48"
          label="我的"
          @mouseenter="handlePreviewEnter(HOME_PROFILE_PAGE_KEY)"
          @mouseleave="handlePreviewLeave"
          @touchstart="handlePreviewTouchStart(HOME_PROFILE_PAGE_KEY)"
          @touchend="handlePreviewTouchEnd"
          @touchcancel="handlePreviewTouchEnd"
          @activate="handleChangeTab(HOME_PROFILE_PAGE_KEY)"
        >
          <view class="home-shell-tabbar-icon-shell" :class="{ 'is-active': props.tabActivityFlags.isProfileTabActive }">
            <view class="home-shell-tabbar-hit">
              <view class="home-shell-tabbar-icon">
                <UserRound class="home-shell-tabbar-icon-svg" :size="24" :stroke-width="1.5" />
              </view>
            </view>
          </view>
        </HomeInteractiveTarget>

        <view class="home-shell-tabbar-preview-rail" :style="previewRailStyle" aria-hidden="true">
          <view class="home-shell-tabbar-preview-pill" />
        </view>

        <view class="home-shell-tabbar-indicator-rail" :style="indicatorRailStyle">
          <view class="home-shell-tabbar-indicator-dot" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, type CSSProperties } from 'vue'
import { Activity, House, UserRound } from 'lucide-vue-next'
import HomeInteractiveTarget from './HomeInteractiveTarget.vue'
import {
  HOME_ACTIVITY_PAGE_KEY,
  HOME_PRIMARY_PAGE_KEY,
  HOME_PROFILE_PAGE_KEY,
  type PageKey,
} from '../../../models/homeShell.model'
import { resolveHomeShellInsets, type ViewportRuntimeContext } from '../../../services/homeShellLayoutMode.service'
import type { HomeShellTabActivityFlags } from '../../../services/homeShellState.service'

interface Props {
  isDoubleMode: boolean
  runtimeContext: ViewportRuntimeContext
  tabActivityFlags: HomeShellTabActivityFlags
}

const props = defineProps<Props>()
const emit = defineEmits<{
  changeTab: [tab: PageKey]
}>()

const TABBAR_BOTTOM_GAP_BASE = 32
const PREVIEW_TOUCH_DELAY = 180
const previewTab = ref<PageKey | null>(null)
let previewTouchTimer: ReturnType<typeof setTimeout> | null = null

const tabbarStyle = computed<CSSProperties>(() => {
  const insets = resolveHomeShellInsets(props.runtimeContext)
  return {
    '--home-tabbar-safe-bottom': `${insets.bottomInset}px`,
    '--home-tabbar-bottom-gap': `${TABBAR_BOTTOM_GAP_BASE}px`,
  } as CSSProperties
})

const activeTabIndex = computed(() => {
  if (props.tabActivityFlags.isActivityTabActive) {
    return 1
  }
  if (props.tabActivityFlags.isProfileTabActive) {
    return 2
  }
  return 0
})

const previewTabIndex = computed(() => {
  if (previewTab.value === HOME_ACTIVITY_PAGE_KEY) {
    return 1
  }
  if (previewTab.value === HOME_PROFILE_PAGE_KEY) {
    return 2
  }
  if (previewTab.value === HOME_PRIMARY_PAGE_KEY) {
    return 0
  }
  return -1
})

const indicatorRailStyle = computed<CSSProperties>(() => {
  return {
    transform: `translateX(${activeTabIndex.value * 100}%)`,
  } as CSSProperties
})

const previewRailStyle = computed<CSSProperties>(() => {
  const hasPreview = previewTabIndex.value >= 0 && previewTabIndex.value !== activeTabIndex.value
  return {
    transform: `translateX(${Math.max(previewTabIndex.value, 0) * 100}%)`,
    opacity: hasPreview ? '1' : '0',
  } as CSSProperties
})

const isTabActive = (tab: PageKey): boolean => {
  if (tab === HOME_PRIMARY_PAGE_KEY) {
    return props.tabActivityFlags.isHomeTabActive
  }
  if (tab === HOME_ACTIVITY_PAGE_KEY) {
    return props.tabActivityFlags.isActivityTabActive
  }
  return props.tabActivityFlags.isProfileTabActive
}

const clearPreviewTouchTimer = () => {
  if (previewTouchTimer) {
    clearTimeout(previewTouchTimer)
    previewTouchTimer = null
  }
}

const clearPreview = () => {
  previewTab.value = null
}

const handlePreviewEnter = (tab: PageKey) => {
  if (isTabActive(tab)) {
    clearPreview()
    return
  }
  previewTab.value = tab
}

const handlePreviewLeave = () => {
  clearPreviewTouchTimer()
  clearPreview()
}

const handlePreviewTouchStart = (tab: PageKey) => {
  clearPreviewTouchTimer()
  clearPreview()
  if (isTabActive(tab)) {
    return
  }

  previewTouchTimer = setTimeout(() => {
    previewTab.value = tab
    previewTouchTimer = null
  }, PREVIEW_TOUCH_DELAY)
}

const handlePreviewTouchEnd = () => {
  clearPreviewTouchTimer()
  clearPreview()
}

const handleChangeTab = (tab: PageKey) => {
  clearPreviewTouchTimer()
  clearPreview()
  emit('changeTab', tab)
}

const handleKeyActivate = (tab: PageKey) => {
  clearPreviewTouchTimer()
  clearPreview()
  emit('changeTab', tab)
}

onBeforeUnmount(() => {
  clearPreviewTouchTimer()
})
</script>

<style lang="scss" scoped>
.home-shell-tabbar-surface {
  position: relative;
  display: flex;
  width: 100%;
  min-height: 64px;
  padding: 8px 16px;
  box-sizing: border-box;
  border-radius: 999px;
  border: 1px solid var(--aether-glass-border, rgba(229, 231, 235, 0.68));
  background-image: var(
    --aether-glass-background-image,
    linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.8) 100%)
  );
  -webkit-backdrop-filter: var(--aether-glass-blur-filter, blur(8px) saturate(1.2));
  backdrop-filter: var(--aether-glass-blur-filter, blur(8px) saturate(1.2));
  box-shadow: var(--aether-glass-shadow, 0 0 44px rgba(15, 23, 42, 0.08));
  overflow: hidden;
}

.home-shell-tabbar-surface::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 58%);
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .home-shell-tabbar-surface {
    background-color: var(--aether-glass-fallback-bg, rgba(250, 250, 250, 0.8));
    background-image: none;
  }
}

.home-shell-tabbar-wrap {
  position: fixed;
  left: 50%;
  bottom: calc(max(var(--home-tabbar-safe-bottom, 0px), var(--window-bottom, 0px)) + var(--home-tabbar-bottom-gap, 32px));
  z-index: 20;
  transform: translateX(-50%);
  width: 272px;
  max-width: calc(100% - 24px);
}

.home-shell-tabbar-track {
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0;
  min-height: 48px;
  isolation: isolate;
}

.home-shell-tabbar-item {
  position: relative;
  z-index: 1;
  display: flex;
  min-width: 0;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  height: 48px;
  cursor: pointer;
  outline: none;
}

.home-shell-tabbar-item:focus-visible .home-shell-tabbar-icon {
  color: #111111;
}

.home-shell-tabbar-icon-shell {
  display: inline-flex;
  transition:
    transform 200ms ease,
    color 160ms ease;
}

.home-shell-tabbar-icon-shell.is-active {
  transform: translateY(-1px) scale(1.0416667);
  animation: home-shell-tabbar-icon-active-in 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.home-shell-tabbar-hit {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-shell-tabbar-item.is-preview .home-shell-tabbar-icon-shell {
  transform: translateY(-1px);
}

.home-shell-tabbar-item.is-preview .home-shell-tabbar-icon {
  color: #6b7280;
}

.home-shell-tabbar-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.home-shell-tabbar-icon-svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.home-shell-tabbar-item.is-active .home-shell-tabbar-icon {
  color: #111111;
}

.home-shell-tabbar-item.is-fixed .home-shell-tabbar-icon {
  color: #475569;
}

.home-shell-tabbar-preview-rail {
  position: absolute;
  left: 0;
  top: 0;
  width: calc(100% / 3);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 0;
  transition:
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 140ms ease;
}

.home-shell-tabbar-preview-pill {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  background: rgba(148, 163, 184, 0.15);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.38);
}

.home-shell-tabbar-indicator-rail {
  position: absolute;
  left: 0;
  bottom: 4px;
  width: calc(100% / 3);
  display: flex;
  justify-content: center;
  pointer-events: none;
  z-index: 2;
  transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
}

.home-shell-tabbar-indicator-dot {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: #22d3ee;
}

@keyframes home-shell-tabbar-icon-active-in {
  0% {
    opacity: 0.76;
    transform: translateY(4px) scale(0.9583333);
  }

  100% {
    opacity: 1;
    transform: translateY(-1px) scale(1.0416667);
  }
}
</style>
