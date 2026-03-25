<template>
  <StandalonePageScaffold route-source="service-entry-page">
    <template #default="{ canOpenDrawer, openDrawer }">
      <view class="service-entry-page">
        <scroll-view class="service-entry-scroll" scroll-y>
          <view class="service-entry-flow">
            <view class="service-entry-header">
              <HomeInteractiveTarget
                class="service-entry-back-entry"
                interaction-mode="compact"
                label="返回上一页"
                @activate="handleBack"
              >
                <ArrowLeft :size="20" :stroke-width="1.9" />
              </HomeInteractiveTarget>

              <view class="service-entry-header-copy">
                <text class="service-entry-header-title">{{ content.title }}</text>
                <text class="service-entry-header-subtitle">{{ content.englishTitle }}</text>
              </view>

              <HomeInteractiveTarget
                v-if="canOpenDrawer"
                class="service-entry-menu-entry"
                interaction-mode="compact"
                label="打开更多服务"
                @activate="openDrawer"
              >
                <Menu :size="20" :stroke-width="1.9" />
              </HomeInteractiveTarget>
              <view v-else class="service-entry-header-spacer" aria-hidden="true" />
            </view>

            <view class="service-entry-hero-card" :class="`tone-${content.tone}`">
              <view class="service-entry-hero-glow" />

              <view class="service-entry-hero-head">
                <view class="service-entry-hero-icon-shell">
                  <component :is="serviceIcon" :size="18" :stroke-width="1.9" />
                </view>

                <view class="service-entry-hero-copy">
                  <view class="service-entry-hero-title-row">
                    <text class="service-entry-hero-title">{{ content.title }}</text>
                    <text class="service-entry-hero-subtitle">{{ content.englishTitle }}</text>
                  </view>
                  <text class="service-entry-hero-status">{{ resolvedStatusLabel }}</text>
                </view>
              </view>

              <text class="service-entry-hero-summary">{{ content.summary }}</text>

              <view v-if="content.badges.length" class="service-entry-badge-row">
                <view v-for="badge in content.badges" :key="badge" class="service-entry-badge-chip">
                  <text class="service-entry-badge-chip-text">{{ badge }}</text>
                </view>
              </view>
            </view>

            <view class="service-entry-metric-grid">
              <view v-for="metric in content.metrics" :key="metric.id" class="service-entry-metric-card">
                <text class="service-entry-metric-label">{{ metric.label }}</text>
                <view class="service-entry-metric-value-row">
                  <text class="service-entry-metric-value">{{ metric.value }}</text>
                  <text v-if="metric.caption" class="service-entry-metric-caption">{{ metric.caption }}</text>
                </view>
              </view>
            </view>

            <view class="service-entry-section-stack">
              <view v-for="section in content.sections" :key="section.id" class="service-entry-section-block">
                <view class="service-entry-section-head">
                  <text class="service-entry-section-title">{{ section.title }}</text>
                  <text class="service-entry-section-subtitle">{{ section.englishTitle }}</text>
                </view>

                <view class="service-entry-section-card">
                  <HomeInteractiveTarget
                    v-for="(item, index) in section.items"
                    :key="item.id"
                    class="service-entry-item-entry"
                    :class="{ 'has-divider': index !== section.items.length - 1 }"
                    label="查看服务条目"
                    @activate="handleSectionItemClick(item)"
                  >
                    <view class="service-entry-item-copy">
                      <text class="service-entry-item-title">{{ item.title }}</text>
                      <text class="service-entry-item-desc">{{ item.description }}</text>
                    </view>

                    <view class="service-entry-item-meta">
                      <text v-if="item.value" class="service-entry-item-value">{{ item.value }}</text>
                      <ChevronRight :size="16" :stroke-width="1.9" />
                    </view>
                  </HomeInteractiveTarget>
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
import { ArrowLeft, ChevronRight, Menu } from 'lucide-vue-next'
import type { Component } from 'vue'
import StandalonePageScaffold from '../../components/StandalonePageScaffold.vue'
import type { ServiceEntryContent, ServiceEntrySectionItem } from '../../models/serviceEntry.model'
import { createServiceEntryContentShell, resolveServiceEntryContent } from '../../services/serviceEntryContent.service'
import { consumeHomeShellServiceReminder, ensureHomeShellMenuReminderHydrated } from '../../services/homeShellMenuState.service'
import { buildActionEntryUrl } from '../../services/homeRailNavigation.service'
import { parseServiceEntryRouteQuery } from '../../services/routeQuery.service'
import { resolveHomeShellDrawerEntries } from '../../services/homeShellMenu.service'
import { resolveHomeShellIconComponent } from '../../utils/homeShellIconMap'
import HomeInteractiveTarget from '../home/components/HomeInteractiveTarget.vue'

const drawerEntryMap = new Map(resolveHomeShellDrawerEntries().map((entry) => [entry.id, entry]))

const content = reactive<ServiceEntryContent>(createServiceEntryContentShell('orders'))

const serviceIcon = computed<Component>(() => {
  const matched = drawerEntryMap.get(content.id)
  return resolveHomeShellIconComponent(matched?.iconKey ?? 'history')
})

const resolvedStatusLabel = computed(() => {
  const normalized = content.statusLabel.trim()
  return normalized.toUpperCase().startsWith('STATUS:') ? normalized.toUpperCase() : `STATUS: ${normalized.toUpperCase()}`
})

const applyContent = (nextContent: ServiceEntryContent) => {
  Object.assign(content, {
    ...nextContent,
    badges: [...nextContent.badges],
    metrics: nextContent.metrics.map((item) => ({ ...item })),
    sections: nextContent.sections.map((section) => ({
      ...section,
      items: section.items.map((item) => ({
        ...item,
        target: item.target ? { ...item.target } : undefined,
      })),
    })),
  })
}

onLoad((query) => {
  const routeQuery = parseServiceEntryRouteQuery(query as Record<string, unknown>)
  applyContent(createServiceEntryContentShell(routeQuery.serviceId))
  void ensureHomeShellMenuReminderHydrated()

  void resolveServiceEntryContent(routeQuery.serviceId)
    .then((nextContent) => {
      applyContent(nextContent)
      void consumeHomeShellServiceReminder(nextContent.id)
    })
    .catch((error) => {
      console.error('[service-entry] failed to hydrate service entry content', error)
    })
})

const handleSectionItemClick = (item: ServiceEntrySectionItem) => {
  if (!item.target) {
    return
  }

  uni.navigateTo({
    url: buildActionEntryUrl(item.target, `service-entry-${content.id}`),
  })
}

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
.service-entry-page {
  width: 100%;
  min-height: 100dvh;
  background:
    radial-gradient(circle at top right, rgba(34, 211, 238, 0.08), transparent 34%),
    linear-gradient(180deg, #fafafa 0%, #f4f5f7 100%);
}

.service-entry-scroll {
  height: 100dvh;
}

.service-entry-flow {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100%;
  padding: 16px 16px 32px;
  box-sizing: border-box;
}

.service-entry-header {
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
}

.service-entry-back-entry,
.service-entry-menu-entry,
.service-entry-header-spacer {
  width: 44px;
  height: 44px;
}

.service-entry-back-entry,
.service-entry-menu-entry {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111111;
}

.service-entry-header-copy {
  min-width: 0;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
}

.service-entry-header-title {
  font-size: 20px;
  line-height: 28px;
  font-weight: 900;
  color: #111111;
}

.service-entry-header-subtitle,
.service-entry-section-subtitle,
.service-entry-hero-subtitle {
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  color: #22d3ee;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transform: scale(0.75);
  transform-origin: left bottom;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.service-entry-hero-card {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  padding: 24px;
  background: #0f172a;
  color: #ffffff;
}

.service-entry-hero-glow {
  position: absolute;
  inset: auto -10% -32% auto;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  filter: blur(48px);
  opacity: 0.28;
}

.service-entry-hero-card.tone-cyan .service-entry-hero-glow {
  background: rgba(34, 211, 238, 0.65);
}

.service-entry-hero-card.tone-green .service-entry-hero-glow {
  background: rgba(74, 222, 128, 0.62);
}

.service-entry-hero-card.tone-amber .service-entry-hero-glow {
  background: rgba(251, 191, 36, 0.58);
}

.service-entry-hero-card.tone-rose .service-entry-hero-glow {
  background: rgba(251, 113, 133, 0.54);
}

.service-entry-hero-card.tone-slate .service-entry-hero-glow {
  background: rgba(148, 163, 184, 0.5);
}

.service-entry-hero-head,
.service-entry-hero-summary,
.service-entry-badge-row {
  position: relative;
  z-index: 1;
}

.service-entry-hero-head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.service-entry-hero-icon-shell {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-entry-hero-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.service-entry-hero-title-row,
.service-entry-section-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.service-entry-hero-title,
.service-entry-section-title {
  font-size: 20px;
  line-height: 28px;
  font-weight: 900;
}

.service-entry-hero-status {
  font-size: 12px;
  line-height: 12px;
  color: rgba(255, 255, 255, 0.72);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.service-entry-hero-summary {
  margin-top: 16px;
  font-size: 14px;
  line-height: 24px;
  color: rgba(255, 255, 255, 0.78);
}

.service-entry-badge-row {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.service-entry-badge-chip {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
}

.service-entry-badge-chip-text,
.service-entry-item-value,
.service-entry-metric-label,
.service-entry-metric-caption {
  font-size: 12px;
  line-height: 12px;
}

.service-entry-badge-chip-text {
  color: #ffffff;
}

.service-entry-metric-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.service-entry-metric-card,
.service-entry-section-card {
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 0 24px rgba(15, 23, 42, 0.05);
}

.service-entry-metric-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.service-entry-metric-label {
  color: #94a3b8;
}

.service-entry-metric-value-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.service-entry-metric-value {
  font-size: 24px;
  line-height: 24px;
  font-weight: 900;
  color: #111111;
}

.service-entry-metric-caption {
  color: #64748b;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.service-entry-section-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.service-entry-section-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.service-entry-section-title,
.service-entry-item-title {
  color: #111111;
}

.service-entry-item-entry {
  min-height: 72px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-sizing: border-box;
}

.service-entry-item-entry.has-divider {
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}

.service-entry-item-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.service-entry-item-title {
  font-size: 15px;
  line-height: 22px;
  font-weight: 800;
}

.service-entry-item-desc {
  font-size: 13px;
  line-height: 20px;
  color: #64748b;
}

.service-entry-item-meta {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
}

.service-entry-item-value {
  font-family: var(--aether-font-system, system-ui, sans-serif);
}
</style>

