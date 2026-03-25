<!--
文件版本：v0021
更新时间：2026-03-24 18:28:00
Encoding: UTF-8
本次更新：小于375设备改为页面级全局等比缩放，统一覆盖壳层与抽屉
-->

<template>
  <view
    class="home-page"
    :class="[layoutMode, { 'is-drawer-open': isDrawerLayerOpen, 'is-global-stage-scaled': isGlobalStageScaled }]"
    :style="pageRuntimeStyle"
  >
    <view class="home-stage-scale-shell">
      <view class="home-stage" :class="[layoutMode]">
        <HomeShellTrackStage
          :layout-mode="layoutMode"
          :runtime-context="runtimeContext"
          :home-shell-derived-state="homeShellDerivedState"
          @open-drawer="handleDrawerOpen"
          @change-tab="handleTabChange"
        />

        <HomeShellDrawer :open="isDrawerLayerOpen" :runtime-context="runtimeContext" @close="handleDrawerClose" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useHomeShellState } from '../../composables/useHomeShellState'
import { useResponsiveRailLayout } from '../../composables/useResponsiveRailLayout'
import { HOME_SHELL_PAGE_KEYS, type PageKey } from '../../models/homeShell.model'
import HomeShellDrawer from './components/HomeShellDrawer.vue'
import HomeShellTrackStage from './components/HomeShellTrackStage.vue'

/**
 * 文件职责：
 * 1. 只维护“现行宽度分档 + 轨道壳层 + 抽屉 + 底部标签栏”。
 * 2. 三主页面内容层统一由占位组件承载，后续逐块替换正式 UI。
 */

const { layoutMode, runtimeContext } = useResponsiveRailLayout()
const globalStageScale = computed(() => {
  const viewportWidth = runtimeContext.value.viewportWidth
  if (viewportWidth <= 0 || viewportWidth >= 375) {
    return 1
  }
  return viewportWidth / 375
})
const isGlobalStageScaled = computed(() => {
  return globalStageScale.value < 1
})
const pageRuntimeStyle = computed<CSSProperties>(() => {
  const viewportHeight = runtimeContext.value.viewportHeight
  const stageHeight = viewportHeight > 0 ? `${viewportHeight}px` : '100dvh'
  const stageScale = globalStageScale.value
  const stageWidth = runtimeContext.value.viewportWidth
  const scaledStageWidth = 375 * stageScale
  const stageOffsetXRaw = stageScale < 1 && stageWidth > scaledStageWidth ? (stageWidth - scaledStageWidth) / 2 : 0
  const stageOffsetX = Math.round(stageOffsetXRaw)
  const compensatedHeight =
    stageScale < 1 && viewportHeight > 0 ? `${Math.round(viewportHeight / stageScale)}px` : stageHeight

  return {
    '--home-global-stage-height': stageHeight,
    '--home-global-stage-scale': `${stageScale}`,
    '--home-global-stage-offset-x': `${stageOffsetX}px`,
    '--home-stage-shell-height': compensatedHeight,
  } as CSSProperties
})

const {
  isDrawerLayerOpen,
  homeShellDerivedState,
  handleDrawerOpen,
  handleDrawerClose,
  handleTabChange,
} = useHomeShellState({
  layoutMode,
})

onLoad((query) => {
  const nextTab = typeof query?.tab === 'string' ? query.tab : ''
  if (!HOME_SHELL_PAGE_KEYS.includes(nextTab as PageKey)) {
    return
  }

  handleTabChange(nextTab as PageKey)
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
