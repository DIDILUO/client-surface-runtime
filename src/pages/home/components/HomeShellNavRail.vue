<!--
文件版本：v0007
更新时间：2026-03-25 23:26:00
Encoding: UTF-8
本次更新：移除窄侧栏占位灰块，按正式主页面切换与高频入口重写
-->

<template>
  <view class="home-shell-nav-rail" :class="{ 'is-floating': props.floating }" :style="railStyle">
    <view class="home-shell-nav-rail-scroll">
      <view class="home-shell-nav-safe-top" />

      <view class="home-shell-nav-group">
        <HomeInteractiveTarget
          v-if="props.canExpandDrawer"
          class="home-shell-nav-hit"
          interaction-mode="compact"
          label="打开更多服务"
          @activate="emit('openDrawer')"
        >
          <view class="home-shell-nav-button home-shell-nav-button-menu">
            <Menu class="home-shell-nav-menu-icon" :size="22" :stroke-width="1.9" />
          </view>
        </HomeInteractiveTarget>
      </view>

      <view class="home-shell-nav-group home-shell-nav-group-main">
        <HomeInteractiveTarget
          v-for="entry in primaryNavEntries"
          :key="entry.id"
          class="home-shell-nav-hit"
          interaction-mode="compact"
          :label="entry.label"
          :selected="isEntryActive(entry)"
          @activate="handleNavActivate(entry)"
        >
          <view
            class="home-shell-nav-button"
            :class="{ 'is-active': isEntryActive(entry) }"
          >
            <component :is="resolveHomeShellIconComponent(entry.iconKey)" :size="20" :stroke-width="1.9" />
          </view>
        </HomeInteractiveTarget>
      </view>

      <view class="home-shell-nav-spacer" />

      <view class="home-shell-nav-group home-shell-nav-group-utility">
        <HomeInteractiveTarget
          v-for="entry in utilityNavEntries"
          :key="entry.id"
          class="home-shell-nav-hit"
          interaction-mode="compact"
          :label="entry.label"
          :selected="isEntryActive(entry)"
          @activate="handleNavActivate(entry)"
        >
          <view class="home-shell-nav-button home-shell-nav-button-utility" :class="{ 'is-active': isEntryActive(entry) }">
            <component :is="resolveHomeShellIconComponent(entry.iconKey)" :size="18" :stroke-width="1.9" />
          </view>
        </HomeInteractiveTarget>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { Menu } from 'lucide-vue-next'
import type { PageKey } from '../../../models/homeShell.model'
import type { HomeShellNavEntry, HomeShellNavEntryId } from '../../../models/homeShellMenu.model'
import HomeInteractiveTarget from './HomeInteractiveTarget.vue'
import { resolveHomeShellInsets, type ViewportRuntimeContext } from '../../../services/homeShellLayoutMode.service'
import { resolveHomeShellNavEntries } from '../../../services/homeShellMenu.service'
import { resolveHomeShellIconComponent } from '../../../utils/homeShellIconMap'

interface Props {
  runtimeContext: ViewportRuntimeContext
  canExpandDrawer: boolean
  activePage?: PageKey
  activeEntryId?: HomeShellNavEntryId
  floating?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  openDrawer: []
  changeTab: [tab: PageKey]
}>()

const navEntries = resolveHomeShellNavEntries()
const primaryNavEntries = navEntries.filter((entry) => entry.pageKey)
const utilityNavEntries = navEntries.filter((entry) => !entry.pageKey)

const railStyle = computed<CSSProperties>(() => {
  const insets = resolveHomeShellInsets(props.runtimeContext)
  return {
    '--home-rail-safe-top': `${insets.topInset}px`,
    '--home-rail-safe-bottom': `${insets.bottomInset}px`,
  } as CSSProperties
})

const handleNavActivate = (entry: HomeShellNavEntry) => {
  if (isEntryActive(entry)) {
    return
  }

  if (entry.pageKey) {
    emit('changeTab', entry.pageKey)
    return
  }

  if (entry.routeUrl) {
    uni.navigateTo({ url: entry.routeUrl })
  }
}

const isEntryActive = (entry: HomeShellNavEntry) => {
  if (props.activeEntryId) {
    return props.activeEntryId === entry.id
  }

  return Boolean(entry.pageKey && props.activePage === entry.pageKey)
}
</script>

<style lang="scss" scoped>
.home-shell-nav-rail {
  width: 76px;
  min-width: 76px;
  max-width: 76px;
  min-height: 100%;
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  background: rgba(250, 250, 250, 0.96);
  box-shadow: 0 0 18px rgba(15, 23, 42, 0.04);
}

.home-shell-nav-rail.is-floating {
  position: absolute;
  top: calc(12px + var(--home-rail-safe-top, 0px));
  right: calc(
    (100% - min(var(--home-page-max-width, 430px), 100%)) / 2 - var(--home-nav-gap, 12px) -
      var(--home-nav-rail-width, 76px)
  );
  z-index: 18;
  bottom: auto;
  height: auto;
  max-height: calc(100% - (24px + var(--home-rail-safe-top, 0px) + var(--home-rail-safe-bottom, 0px)));
  min-height: auto;
  background: rgba(250, 250, 250, 0.88);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .home-shell-nav-rail.is-floating {
    background: #fafafa;
  }
}

.home-shell-nav-rail-scroll {
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: calc(8px + var(--home-rail-safe-top, 0px)) 16px calc(12px + var(--home-rail-safe-bottom, 0px));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  scrollbar-width: none;
}

.home-shell-nav-rail-scroll::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.home-shell-nav-safe-top {
  width: 100%;
  height: 0;
  flex: 0 0 auto;
}

.home-shell-nav-group {
  width: 44px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.home-shell-nav-group-main {
  gap: 10px;
}

.home-shell-nav-group-utility {
  padding-top: 12px;
  border-top: 1px solid rgba(226, 232, 240, 0.88);
}

.home-shell-nav-spacer {
  flex: 1 1 auto;
  width: 100%;
}

.home-shell-nav-hit {
  width: 44px;
  height: 44px;
}

.home-shell-nav-button {
  width: 40px;
  height: 40px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.92);
  color: #64748b;
  transition:
    transform 180ms ease,
    color 180ms ease,
    background-color 180ms ease,
    box-shadow 180ms ease;
}

.home-shell-nav-button.is-active {
  background: #111111;
  color: #22d3ee;
  box-shadow: 0 0 16px rgba(15, 23, 42, 0.08);
}

.home-shell-nav-button-utility {
  background: #f4f5f7;
  color: #64748b;
}

.home-shell-nav-menu-icon {
  color: inherit;
}

@media (hover: hover) and (pointer: fine) {
  .home-shell-nav-hit:hover .home-shell-nav-button:not(.is-active) {
    transform: translateY(-1px);
    background: #ffffff;
    color: #334155;
    box-shadow: 0 0 14px rgba(15, 23, 42, 0.05);
  }
}
</style>
