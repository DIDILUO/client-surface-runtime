<!--
文件版本：v0023
更新时间：2026-03-25 19:13:00
Encoding: UTF-8
本次更新：同步导航栏抬高后的内容占位高度，避免首屏内容被遮挡
-->

<template>
  <view class="home-main-stage" :style="runtimeStyle">
    <view
      class="home-main-stage-inner"
      :class="[trackLayoutState.stageModeClass, { 'is-mobile-floating-nav': isMobileFloatingNav }]"
    >
      <view class="home-content-stage">
        <view class="home-page-grid" :class="trackLayoutState.pageGridClass">
          <view v-for="page in props.homeShellDerivedState.visiblePages" :key="page" class="home-page-track">
            <view class="home-track-top-inset" />

            <view v-if="page === HOME_PRIMARY_PAGE_KEY" class="home-track-home-topbar">
              <HomeRailTopbar
                :can-open-drawer="trackLayoutState.canUseDrawer"
                :is-scrolled="homeTrackScrolled"
                @open-drawer="handleOpenDrawer"
              />
            </view>

            <view
              class="home-track-scroll"
              :class="{ 'is-home-detached-topbar': page === HOME_PRIMARY_PAGE_KEY }"
              @scroll="handleTrackScroll(page, $event)"
            >
              <template v-if="page === HOME_PRIMARY_PAGE_KEY">
                <view class="home-track-home-topbar-placeholder" />
                <HomeRailHomePanel :can-open-drawer="trackLayoutState.canUseDrawer" @open-drawer="handleOpenDrawer" />
              </template>

              <template v-else-if="page === HOME_ACTIVITY_PAGE_KEY">
                <HomeRailActivityPanel />
              </template>

              <template v-else>
                <HomeRailProfilePanel />
              </template>
            </view>
          </view>
        </view>

        <HomeShellTabbar
          v-if="trackLayoutState.showBottomTabbar"
          :is-double-mode="trackLayoutState.isDoubleMode"
          :runtime-context="props.runtimeContext"
          :tab-activity-flags="props.homeShellDerivedState.tabActivityFlags"
          @change-tab="handleChangeTab"
        />
      </view>

      <HomeShellNavRail
        v-if="trackLayoutState.showNavRail"
        :runtime-context="props.runtimeContext"
        :can-expand-drawer="trackLayoutState.canUseDrawer"
        :active-page="props.homeShellDerivedState.visiblePages[0] ?? HOME_PRIMARY_PAGE_KEY"
        :floating="isMobileFloatingNav"
        @open-drawer="handleOpenDrawer"
        @change-tab="handleChangeTab"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, type CSSProperties } from 'vue'
import {
  HOME_ACTIVITY_PAGE_KEY,
  HOME_LAYOUT_NAV_GAP,
  HOME_LAYOUT_NAV_RAIL_WIDTH,
  HOME_LAYOUT_PAGE_MAX_WIDTH,
  HOME_LAYOUT_MODE_SINGLE_PAGE_WITH_NAV,
  HOME_PRIMARY_PAGE_KEY,
  type LayoutMode,
  type PageKey,
} from '../../../models/homeShell.model'
import {
  resolveHomeShellInsets,
  resolveHomeShellTrackLayoutState,
  type ViewportRuntimeContext,
} from '../../../services/homeShellLayoutMode.service'
import type { HomeShellDerivedState } from '../../../services/homeShellState.service'
import HomeRailActivityPanel from './HomeRailActivityPanel.vue'
import HomeRailHomePanel from './HomeRailHomePanel.vue'
import HomeRailTopbar from './HomeRailTopbar.vue'
import HomeRailProfilePanel from './HomeRailProfilePanel.vue'
import HomeShellNavRail from './HomeShellNavRail.vue'
import HomeShellTabbar from './HomeShellTabbar.vue'

interface Props {
  layoutMode: LayoutMode
  runtimeContext: ViewportRuntimeContext
  homeShellDerivedState: HomeShellDerivedState
}

const props = defineProps<Props>()
const emit = defineEmits<{
  openDrawer: []
  changeTab: [tab: PageKey]
}>()

const trackLayoutState = computed(() => resolveHomeShellTrackLayoutState(props.layoutMode))
const homeTrackScrolled = ref(false)
const isTouchLikeDevice = computed(() => {
  return (
    props.runtimeContext.pointerType === 'touch' ||
    (props.runtimeContext.pointerType === 'hybrid' && !props.runtimeContext.hoverCapable)
  )
})
const isMobileFloatingNav = computed(() => {
  return props.layoutMode === HOME_LAYOUT_MODE_SINGLE_PAGE_WITH_NAV && isTouchLikeDevice.value
})
const runtimeInsets = computed(() => resolveHomeShellInsets(props.runtimeContext))
const runtimeStyle = computed<CSSProperties>(() => {
  const stageHeight = props.runtimeContext.viewportHeight > 0 ? `${props.runtimeContext.viewportHeight}px` : '100dvh'
  const tabbarReserve = trackLayoutState.value.showBottomTabbar ? 128 : 24

  return {
    '--home-safe-top': `${runtimeInsets.value.topInset}px`,
    '--home-safe-bottom': `${runtimeInsets.value.bottomInset}px`,
    '--home-stage-height': stageHeight,
    '--home-tabbar-reserve': `${tabbarReserve}px`,
    '--home-page-max-width': `${HOME_LAYOUT_PAGE_MAX_WIDTH}px`,
    '--home-nav-rail-width': `${HOME_LAYOUT_NAV_RAIL_WIDTH}px`,
    '--home-nav-gap': `${HOME_LAYOUT_NAV_GAP}px`,
    '--home-web-max-width': '1280px',
  } as CSSProperties
})

const handleOpenDrawer = () => {
  emit('openDrawer')
}

const handleChangeTab = (tab: PageKey) => {
  emit('changeTab', tab)
}

interface HomeTrackScrollEvent {
  detail?: number | { scrollTop?: number }
  target?: EventTarget | null
  currentTarget?: EventTarget | null
}

const handleTrackScroll = (page: PageKey, event: HomeTrackScrollEvent) => {
  if (page !== HOME_PRIMARY_PAGE_KEY) {
    return
  }
  const detailScrollTop = typeof event.detail === 'number' ? event.detail : event.detail?.scrollTop
  const targetScrollTop = (event.target as HTMLElement | null)?.scrollTop
  const currentTargetScrollTop = (event.currentTarget as HTMLElement | null)?.scrollTop
  const scrollTop = detailScrollTop ?? targetScrollTop ?? currentTargetScrollTop ?? 0
  homeTrackScrolled.value = scrollTop > 0
}
</script>

<style lang="scss" scoped>
.home-main-stage {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  height: var(--home-stage-shell-height, var(--home-stage-height, 100dvh));
  min-height: var(--home-stage-shell-height, var(--home-stage-height, 100dvh));
  background: #fafafa;
  overflow: hidden;
  box-sizing: border-box;
}

.home-main-stage-inner {
  display: grid;
  width: 100%;
  height: var(--home-stage-shell-height, var(--home-stage-height, 100dvh));
  min-height: var(--home-stage-shell-height, var(--home-stage-height, 100dvh));
  transform-origin: top center;
}

.home-main-stage-inner.mode-single {
  grid-template-columns: minmax(0, var(--home-page-max-width, 430px));
  justify-content: center;
}

.home-main-stage-inner.mode-single-nav {
  grid-template-columns: minmax(375px, var(--home-page-max-width, 430px)) var(--home-nav-rail-width, 76px);
  column-gap: var(--home-nav-gap, 12px);
  justify-content: center;
}

.home-main-stage-inner.mode-single-nav.is-mobile-floating-nav {
  width: 100%;
  max-width: 100%;
  grid-template-columns: minmax(0, var(--home-page-max-width, 430px));
  column-gap: 0;
  justify-content: center;
}

.home-main-stage-inner.mode-double {
  grid-template-columns: minmax(0, 860px);
  justify-content: center;
}

.home-main-stage-inner.mode-triple {
  grid-template-columns: minmax(0, 1290px);
  justify-content: center;
}

.home-content-stage {
  position: relative;
  min-width: 0;
  height: var(--home-stage-shell-height, var(--home-stage-height, 100dvh));
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #fafafa;
}

.home-page-grid {
  display: grid;
  flex: 1 1 auto;
  height: 100%;
  min-height: 0;
}

.home-page-grid.is-single {
  grid-template-columns: minmax(0, 1fr);
}

.home-page-grid.is-double {
  grid-template-columns: repeat(2, minmax(375px, 430px));
  justify-content: center;
}

.home-page-grid.is-triple {
  grid-template-columns: repeat(3, minmax(375px, 430px));
  justify-content: center;
}

.home-page-track {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: #fafafa;
  box-sizing: border-box;
}

.home-track-top-inset {
  flex: 0 0 auto;
  height: var(--home-safe-top, 0px);
}

.home-track-home-topbar {
  position: absolute;
  left: 0;
  right: 0;
  top: var(--home-safe-top, 0px);
  z-index: 16;
  pointer-events: auto;
}

.home-track-home-topbar-placeholder {
  flex: 0 0 auto;
  min-height: 64px;
  max-height: 64px;
  height: 64px;
  margin-bottom: 8px;
}

.home-track-scroll.is-home-detached-topbar {
  padding-top: 0;
}

.home-track-scroll.is-home-detached-topbar .home-panel {
  min-height: 100%;
}

.home-track-scroll {
  --home-page-inline-padding: 20px;
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior-y: contain;
  padding: 12px 0 calc(var(--home-tabbar-reserve, 128px) + var(--home-safe-bottom, 0px));
  box-sizing: border-box;
  display: block;
  scrollbar-width: none;
  background: #fafafa;
}

.home-track-scroll::-webkit-scrollbar {
  width: 0;
  height: 0;
}

@media screen and (width < 430px) {
  .home-track-home-topbar {
    left: 0;
    right: 0;
  }

  .home-track-scroll {
    --home-page-inline-padding: 16px;
    padding: 12px 0 calc(var(--home-tabbar-reserve, 128px) + var(--home-safe-bottom, 0px));
  }

  .home-track-scroll.is-home-detached-topbar {
    padding-top: 0;
  }
}

</style>
