<template>
  <StandalonePageScaffold route-source="action-entry-page">
    <template #default="{ canOpenDrawer, openDrawer }">
      <view class="action-entry-page">
        <scroll-view class="action-entry-scroll" scroll-y>
          <view class="action-entry-flow">
            <view class="action-entry-header">
              <HomeInteractiveTarget
                class="action-entry-back-entry"
                interaction-mode="compact"
                label="返回上一页"
                @activate="handleBack"
              >
                <ArrowLeft :size="20" :stroke-width="1.9" />
              </HomeInteractiveTarget>

              <view class="action-entry-header-copy">
                <text class="action-entry-header-title">{{ content.title }}</text>
                <text class="action-entry-header-subtitle">{{ content.englishTitle }}</text>
              </view>

              <HomeInteractiveTarget
                v-if="canOpenDrawer"
                class="action-entry-menu-entry"
                interaction-mode="compact"
                label="打开更多服务"
                @activate="openDrawer"
              >
                <Menu :size="20" :stroke-width="1.9" />
              </HomeInteractiveTarget>
              <view v-else class="action-entry-header-spacer" aria-hidden="true" />
            </view>

            <view class="action-entry-hero-card" :class="`tone-${content.tone}`">
              <view class="action-entry-hero-glow" />

              <view class="action-entry-hero-head">
                <view class="action-entry-hero-icon-shell">
                  <component :is="resolvedIcon" :size="18" :stroke-width="1.9" />
                </view>

                <view class="action-entry-hero-copy">
                  <view class="action-entry-hero-title-row">
                    <text class="action-entry-hero-title">{{ content.title }}</text>
                    <text class="action-entry-hero-subtitle">{{ content.englishTitle }}</text>
                  </view>
                  <text class="action-entry-hero-status">{{ resolvedStatusLabel }}</text>
                </view>
              </view>

              <text class="action-entry-hero-summary">{{ content.summary }}</text>

              <view v-if="content.badges.length" class="action-entry-badge-row">
                <view v-for="badge in content.badges" :key="badge" class="action-entry-badge-chip">
                  <text class="action-entry-badge-chip-text">{{ badge }}</text>
                </view>
              </view>
            </view>

            <view class="action-entry-metric-grid">
              <view v-for="metric in content.metrics" :key="metric.id" class="action-entry-metric-card">
                <text class="action-entry-metric-label">{{ metric.label }}</text>
                <view class="action-entry-metric-value-row">
                  <text class="action-entry-metric-value">{{ metric.value }}</text>
                  <text v-if="metric.caption" class="action-entry-metric-caption">{{ metric.caption }}</text>
                </view>
              </view>
            </view>

            <view class="action-entry-section-stack">
              <view v-for="section in content.sections" :key="section.id" class="action-entry-section-block">
                <view class="action-entry-section-head">
                  <text class="action-entry-section-title">{{ section.title }}</text>
                  <text class="action-entry-section-subtitle">{{ section.englishTitle }}</text>
                </view>

                <view class="action-entry-section-card">
                  <HomeInteractiveTarget
                    v-for="(item, index) in section.items"
                    :key="item.id"
                    class="action-entry-item-entry"
                    :class="{ 'has-divider': index !== section.items.length - 1 }"
                    label="查看动作条目"
                    @activate="handleSectionItemClick(item)"
                  >
                    <view class="action-entry-item-copy">
                      <text class="action-entry-item-title">{{ item.title }}</text>
                      <text class="action-entry-item-desc">{{ item.description }}</text>
                    </view>

                    <view class="action-entry-item-meta">
                      <text v-if="item.value" class="action-entry-item-value">{{ item.value }}</text>
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
import { ArrowLeft, ChevronRight, Menu, Search, SlidersHorizontal, Workflow } from 'lucide-vue-next'
import type { Component } from 'vue'
import StandalonePageScaffold from '../../components/StandalonePageScaffold.vue'
import type { ActionEntryContent, ActionEntrySectionItem } from '../../models/actionEntry.model'
import { createActionEntryShell, resolveActionEntryContent } from '../../services/actionEntryContent.service'
import {
  buildActionEntryUrl,
  buildContentResourceUrl,
  buildUpdatingUrlByTarget,
} from '../../services/homeRailNavigation.service'
import { parseActionEntryRouteQuery } from '../../services/routeQuery.service'
import HomeInteractiveTarget from '../home/components/HomeInteractiveTarget.vue'

const content = reactive<ActionEntryContent>(createActionEntryShell('service_action', 'orders-pending'))

const resolvedIcon = computed<Component>(() => {
  if (content.resourceType === 'market_action') {
    return Search
  }

  return content.resourceType === 'settings_action' ? SlidersHorizontal : Workflow
})

const resolvedStatusLabel = computed(() => {
  const normalized = content.statusLabel.trim()
  return normalized.toUpperCase().startsWith('STATUS:') ? normalized.toUpperCase() : `STATUS: ${normalized.toUpperCase()}`
})

const applyContent = (nextContent: ActionEntryContent) => {
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
  const routeQuery = parseActionEntryRouteQuery(query as Record<string, unknown>)
  applyContent(createActionEntryShell(routeQuery.resourceType, routeQuery.actionId))

  void resolveActionEntryContent(routeQuery.resourceType, routeQuery.actionId)
    .then((nextContent) => {
      applyContent(nextContent)
    })
    .catch((error) => {
      console.error('[action-entry] failed to hydrate action content', error)
    })
})

const handleSectionItemClick = (item: ActionEntrySectionItem) => {
  if (!item.target) {
    return
  }

  const url =
    item.target.targetType === 'market_action' ||
    item.target.targetType === 'service_action' ||
    item.target.targetType === 'settings_action'
      ? buildActionEntryUrl(item.target, 'action-entry-related')
      : item.target.targetType === 'home_banner' || item.target.targetType === 'drop' || item.target.targetType === 'market_item'
        ? buildContentResourceUrl(item.target, 'action-entry-related')
      : buildUpdatingUrlByTarget({
          target: item.target,
          title: item.title,
          source: 'action-entry-related',
        })

  uni.navigateTo({ url })
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
.action-entry-page {
  width: 100%;
  min-height: 100dvh;
  background:
    radial-gradient(circle at top right, rgba(34, 211, 238, 0.08), transparent 34%),
    linear-gradient(180deg, #fafafa 0%, #f4f5f7 100%);
}

.action-entry-scroll {
  height: 100dvh;
}

.action-entry-flow {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100%;
  padding: 16px 16px 32px;
  box-sizing: border-box;
}

.action-entry-header {
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
}

.action-entry-back-entry,
.action-entry-menu-entry,
.action-entry-header-spacer {
  width: 44px;
  height: 44px;
}

.action-entry-back-entry,
.action-entry-menu-entry {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111111;
}

.action-entry-header-copy {
  min-width: 0;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
}

.action-entry-header-title {
  font-size: 20px;
  line-height: 28px;
  font-weight: 900;
  color: #111111;
}

.action-entry-header-subtitle {
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

.action-entry-hero-card {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  padding: 24px;
  background: #0f172a;
  color: #ffffff;
}

.action-entry-hero-glow {
  position: absolute;
  inset: auto -10% -32% auto;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  filter: blur(48px);
  opacity: 0.28;
}

.action-entry-hero-card.tone-cyan .action-entry-hero-glow {
  background: rgba(34, 211, 238, 0.65);
}

.action-entry-hero-card.tone-green .action-entry-hero-glow {
  background: rgba(74, 222, 128, 0.62);
}

.action-entry-hero-card.tone-amber .action-entry-hero-glow {
  background: rgba(251, 191, 36, 0.58);
}

.action-entry-hero-card.tone-rose .action-entry-hero-glow {
  background: rgba(251, 113, 133, 0.54);
}

.action-entry-hero-card.tone-slate .action-entry-hero-glow {
  background: rgba(148, 163, 184, 0.5);
}

.action-entry-hero-head,
.action-entry-hero-summary,
.action-entry-badge-row {
  position: relative;
  z-index: 1;
}

.action-entry-hero-head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.action-entry-hero-icon-shell {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-entry-hero-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-entry-hero-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
}

.action-entry-hero-title {
  font-size: 24px;
  line-height: 32px;
  font-weight: 900;
}

.action-entry-hero-subtitle,
.action-entry-section-subtitle {
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  color: #67e8f9;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transform: scale(0.75);
  transform-origin: left bottom;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.action-entry-hero-status {
  font-size: 12px;
  line-height: 12px;
  color: rgba(255, 255, 255, 0.72);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.action-entry-hero-summary {
  margin-top: 16px;
  font-size: 14px;
  line-height: 24px;
  color: rgba(255, 255, 255, 0.78);
}

.action-entry-badge-row {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.action-entry-badge-chip {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
}

.action-entry-badge-chip-text {
  font-size: 12px;
  line-height: 12px;
  color: #ffffff;
}

.action-entry-metric-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.action-entry-metric-card,
.action-entry-section-card {
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 0 24px rgba(15, 23, 42, 0.05);
}

.action-entry-metric-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-entry-metric-label {
  font-size: 12px;
  line-height: 12px;
  color: #94a3b8;
}

.action-entry-metric-value-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.action-entry-metric-value {
  font-size: 24px;
  line-height: 24px;
  font-weight: 900;
  color: #111111;
}

.action-entry-metric-caption {
  font-size: 12px;
  line-height: 12px;
  color: #64748b;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.action-entry-section-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.action-entry-section-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-entry-section-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.action-entry-section-title {
  font-size: 20px;
  line-height: 28px;
  font-weight: 900;
  color: #111111;
}

.action-entry-item-entry {
  min-height: 72px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-sizing: border-box;
}

.action-entry-item-entry.has-divider {
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}

.action-entry-item-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-entry-item-title {
  font-size: 15px;
  line-height: 22px;
  font-weight: 800;
  color: #111111;
}

.action-entry-item-desc {
  font-size: 13px;
  line-height: 20px;
  color: #64748b;
}

.action-entry-item-meta {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
}

.action-entry-item-value {
  font-size: 12px;
  line-height: 12px;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}
</style>

