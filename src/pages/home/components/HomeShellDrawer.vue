<!--
文件版本：v0006
更新时间：2026-03-25 23:26:00
Encoding: UTF-8
本次更新：移除占位抽屉，按旧架构语义重写首页更多服务抽屉
-->

<template>
  <view
    class="home-shell-drawer-mask"
    :class="{ 'is-open': props.open }"
    @tap="emitClose"
    @touchmove.stop.prevent
  />

  <view
    class="home-shell-side-drawer"
    :class="{ 'is-open': props.open }"
    :style="drawerStyle"
    @tap.stop
    @touchmove.stop.prevent
  >
    <view class="home-shell-drawer-panel">
      <view class="home-shell-drawer-safe-top" />

      <view class="home-shell-drawer-head">
        <view class="home-shell-drawer-copy">
          <text class="home-shell-drawer-title">更多服务</text>
          <text class="home-shell-drawer-subtitle">Service_Hub</text>
        </view>

        <HomeInteractiveTarget
          class="home-shell-drawer-close-entry"
          interaction-mode="compact"
          label="关闭更多服务"
          @activate="emitClose"
        >
          <view class="home-shell-drawer-close-visual">
            <X :size="18" :stroke-width="1.9" />
          </view>
        </HomeInteractiveTarget>
      </view>

      <scroll-view class="home-shell-drawer-scroll" scroll-y>
        <view class="home-shell-drawer-list">
          <HomeInteractiveTarget
            v-for="entry in drawerEntries"
            :key="entry.id"
            class="home-shell-drawer-item-entry"
            :label="entry.label"
            @activate="handleEntryActivate(entry.routeUrl)"
          >
            <view class="home-shell-drawer-item">
              <view class="home-shell-drawer-item-left">
                <view class="home-shell-drawer-icon-shell">
                  <component :is="resolveHomeShellIconComponent(entry.iconKey)" :size="16" :stroke-width="1.8" />
                  <view
                    v-if="entry.indicator?.visible"
                    class="home-shell-drawer-indicator"
                    :class="`tone-${entry.indicator.tone}`"
                  />
                </view>

                <view class="home-shell-drawer-labels">
                  <text class="home-shell-drawer-item-title">{{ entry.label }}</text>
                  <text class="home-shell-drawer-item-subtitle">{{ entry.englishLabel }}</text>
                </view>
              </view>

              <view class="home-shell-drawer-item-right">
                <view
                  v-if="entry.badge"
                  class="home-shell-drawer-badge"
                  :class="`tone-${entry.badge.tone}`"
                >
                  <text class="home-shell-drawer-badge-label">{{ entry.badge.label }}</text>
                  <text v-if="entry.badge.value" class="home-shell-drawer-badge-value">{{ entry.badge.value }}</text>
                </view>

                <ChevronRight class="home-shell-drawer-chevron" :size="16" :stroke-width="1.9" />
              </view>
            </view>
          </HomeInteractiveTarget>
        </view>
      </scroll-view>

      <view class="home-shell-drawer-footer">
        <text class="home-shell-drawer-footer-copy">v1.0.0 Alpha / AETHER_OS</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, type CSSProperties } from 'vue'
import { ChevronRight, X } from 'lucide-vue-next'
import HomeInteractiveTarget from './HomeInteractiveTarget.vue'
import { resolveHomeShellInsets, type ViewportRuntimeContext } from '../../../services/homeShellLayoutMode.service'
import { ensureHomeShellMenuReminderHydrated, useResolvedHomeShellDrawerEntries } from '../../../services/homeShellMenuState.service'
import { resolveHomeShellIconComponent } from '../../../utils/homeShellIconMap'

interface Props {
  open: boolean
  runtimeContext: ViewportRuntimeContext
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const drawerEntries = useResolvedHomeShellDrawerEntries()

const drawerStyle = computed<CSSProperties>(() => {
  const insets = resolveHomeShellInsets(props.runtimeContext)
  return {
    '--home-drawer-safe-top': `${insets.topInset}px`,
    '--home-drawer-safe-bottom': `${insets.bottomInset}px`,
  } as CSSProperties
})

const emitClose = () => {
  emit('close')
}

const handleEntryActivate = (routeUrl: string) => {
  emitClose()
  setTimeout(() => {
    uni.navigateTo({ url: routeUrl })
  }, 40)
}

onMounted(() => {
  void ensureHomeShellMenuReminderHydrated()
})
</script>

<style lang="scss" scoped>
.home-shell-drawer-mask {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(15, 23, 42, 0);
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 200ms ease,
    background-color 200ms ease;
}

.home-shell-drawer-mask.is-open {
  opacity: 1;
  pointer-events: auto;
  background: rgba(15, 23, 42, 0.4);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .home-shell-drawer-mask.is-open {
    background: rgba(15, 23, 42, 0.48);
  }
}

.home-shell-side-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  width: min(304px, calc(100vw - 24px));
  transform: translateX(100%);
  transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
}

.home-shell-side-drawer.is-open {
  transform: translateX(0);
  pointer-events: auto;
}

.home-shell-drawer-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(250, 250, 250, 0.98);
  border-left: 1px solid rgba(226, 232, 240, 0.92);
  box-shadow: 0 0 24px rgba(15, 23, 42, 0.08);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .home-shell-drawer-panel {
    background: #fafafa;
  }
}

.home-shell-drawer-safe-top {
  width: 100%;
  height: var(--home-drawer-safe-top, 0px);
  flex: 0 0 auto;
}

.home-shell-drawer-head {
  flex: 0 0 auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 20px 16px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
}

.home-shell-drawer-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.home-shell-drawer-title {
  font-size: 20px;
  line-height: 24px;
  font-weight: 900;
  color: #111111;
}

.home-shell-drawer-subtitle {
  font-family: var(--aether-font-system, system-ui, sans-serif);
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.16em;
  color: #94a3b8;
  text-transform: uppercase;
}

.home-shell-drawer-close-entry {
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
}

.home-shell-drawer-close-visual {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.92);
  color: #111111;
  box-shadow: 0 0 12px rgba(15, 23, 42, 0.04);
}

.home-shell-drawer-scroll {
  flex: 1 1 auto;
  min-height: 0;
}

.home-shell-drawer-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  box-sizing: border-box;
}

.home-shell-drawer-item-entry {
  border-radius: 20px;
}

.home-shell-drawer-item {
  min-height: 72px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  box-sizing: border-box;
  box-shadow: 0 0 14px rgba(15, 23, 42, 0.03);
  transition:
    transform 180ms ease,
    background-color 180ms ease,
    box-shadow 180ms ease;
}

.home-shell-drawer-item-left {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  gap: 12px;
}

.home-shell-drawer-icon-shell {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  background: #f4f5f7;
  transition:
    background-color 180ms ease,
    color 180ms ease;
}

.home-shell-drawer-indicator {
  position: absolute;
  top: -1px;
  right: -1px;
  width: 6px;
  height: 6px;
  border-radius: 999px;
}

.home-shell-drawer-indicator.tone-cyan {
  background: #22d3ee;
}

.home-shell-drawer-indicator.tone-green {
  background: #34d399;
}

.home-shell-drawer-indicator.tone-amber {
  background: #f59e0b;
}

.home-shell-drawer-indicator.tone-rose {
  background: #fb7185;
}

.home-shell-drawer-indicator.tone-red {
  background: #ef4444;
}

.home-shell-drawer-labels {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.home-shell-drawer-item-title {
  min-width: 0;
  font-size: 14px;
  line-height: 20px;
  font-weight: 800;
  color: #111111;
}

.home-shell-drawer-item-subtitle {
  min-width: 0;
  font-family: var(--aether-font-system, system-ui, sans-serif);
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 0.14em;
  color: #94a3b8;
  text-transform: uppercase;
}

.home-shell-drawer-item-right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.home-shell-drawer-badge {
  min-height: 24px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 10px;
  box-sizing: border-box;
}

.home-shell-drawer-badge-label,
.home-shell-drawer-badge-value {
  font-size: 10px;
  line-height: 12px;
  font-weight: 800;
}

.home-shell-drawer-badge-value {
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.home-shell-drawer-badge.tone-success {
  background: #ecfdf5;
  color: #10b981;
}

.home-shell-drawer-badge.tone-info {
  background: #ecfeff;
  color: #0891b2;
}

.home-shell-drawer-badge.tone-accent {
  background: #f4f8ff;
  color: #4c7bef;
}

.home-shell-drawer-chevron {
  color: #cbd5e1;
  transition:
    color 180ms ease,
    transform 180ms ease;
}

.home-shell-drawer-footer {
  flex: 0 0 auto;
  padding: 20px 20px calc(20px + var(--home-drawer-safe-bottom, 0px));
  border-top: 1px solid rgba(226, 232, 240, 0.9);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-shell-drawer-footer-copy {
  font-family: var(--aether-font-system, system-ui, sans-serif);
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 0.14em;
  color: #94a3b8;
  text-transform: uppercase;
}

@media (hover: hover) and (pointer: fine) {
  .home-shell-drawer-item-entry:hover .home-shell-drawer-item {
    transform: translateX(-2px);
    background: #ffffff;
    box-shadow: 0 0 18px rgba(15, 23, 42, 0.05);
  }

  .home-shell-drawer-item-entry:hover .home-shell-drawer-icon-shell {
    color: #22d3ee;
    background: #111111;
  }

  .home-shell-drawer-item-entry:hover .home-shell-drawer-chevron {
    color: #111111;
    transform: translateX(1px);
  }
}
</style>

