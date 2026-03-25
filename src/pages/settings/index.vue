<template>
  <StandalonePageScaffold active-nav-entry-id="settings" route-source="settings-page">
    <template #default="{ canOpenDrawer, openDrawer }">
      <view class="settings-page">
        <scroll-view class="settings-scroll" scroll-y>
          <view class="settings-flow">
            <view class="settings-header">
              <HomeInteractiveTarget
                class="settings-back-entry"
                interaction-mode="compact"
                label="返回上一页"
                @activate="handleBack"
              >
                <ArrowLeft :size="20" :stroke-width="1.9" />
              </HomeInteractiveTarget>

              <view class="settings-header-copy">
                <text class="settings-header-title">系统设置</text>
                <text class="settings-header-subtitle">CONFIGURATION</text>
              </view>

              <HomeInteractiveTarget
                v-if="canOpenDrawer"
                class="settings-menu-entry"
                interaction-mode="compact"
                label="打开更多服务"
                @activate="openDrawer"
              >
                <Menu :size="20" :stroke-width="1.9" />
              </HomeInteractiveTarget>
              <view v-else class="settings-header-spacer" aria-hidden="true" />
            </view>

            <view class="settings-summary-card">
              <view class="settings-summary-glow" />
              <view class="settings-summary-eyebrow-row">
                <view class="settings-summary-dot" />
                <text class="settings-summary-eyebrow">{{ summary.englishTitle }}</text>
              </view>

              <view class="settings-summary-title-row">
                <text class="settings-summary-title">{{ summary.title }}</text>
                <text class="settings-summary-title-sub">{{ summary.englishTitle }}</text>
              </view>

              <text class="settings-summary-desc">{{ summary.description }}</text>

              <HomeInteractiveTarget
                class="settings-summary-action"
                interaction-mode="compact"
                label="打开问题反馈入口"
                @activate="handleSummaryActionClick"
              >
                <view class="settings-summary-action-pill">
                  <MessageCircleMore :size="16" :stroke-width="1.8" />
                  <text class="settings-summary-action-main">{{ summary.actionLabel }}</text>
                  <text class="settings-summary-action-sub">{{ summary.actionEnglishLabel }}</text>
                </view>
              </HomeInteractiveTarget>
            </view>

            <view class="settings-section-stack">
              <view v-for="section in sections" :key="section.id" class="settings-section-block">
                <view class="settings-section-head">
                  <text class="settings-section-title">{{ section.title }}</text>
                  <text class="settings-section-subtitle">{{ section.englishTitle }}</text>
                </view>

                <view class="settings-section-card">
                  <HomeInteractiveTarget
                    v-for="(item, index) in section.items"
                    :key="item.id"
                    class="settings-item-entry"
                    :class="{ 'has-divider': index !== section.items.length - 1 }"
                    label="查看设置项"
                    @activate="handleSettingItemClick(item)"
                  >
                    <view class="settings-item-icon-wrap">
                      <component :is="resolveSettingIcon(item.id)" :size="18" :stroke-width="1.8" />
                    </view>

                    <view class="settings-item-copy">
                      <text class="settings-item-title">{{ item.title }}</text>
                    </view>

                    <view class="settings-item-meta">
                      <text class="settings-item-value">{{ item.value }}</text>
                      <ChevronRight :size="16" :stroke-width="1.9" />
                    </view>
                  </HomeInteractiveTarget>
                </view>
              </view>
            </view>

            <HomeInteractiveTarget
              class="settings-logout-entry"
              label="打开退出登录流程"
              @activate="handleLogoutClick"
            >
              <view class="settings-logout-pill">
                <LogOut :size="16" :stroke-width="2" />
                <text class="settings-logout-text">退出登录</text>
              </view>
            </HomeInteractiveTarget>
          </view>
        </scroll-view>
      </view>
    </template>
  </StandalonePageScaffold>
</template>

<script setup lang="ts">
import { reactive, ref, type Component } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import {
  ArrowLeft,
  BellRing,
  ChevronRight,
  Languages,
  LogOut,
  Menu,
  MessageCircleMore,
  Paintbrush,
  ShieldCheck,
  UserRound,
  Wallet,
} from 'lucide-vue-next'
import StandalonePageScaffold from '../../components/StandalonePageScaffold.vue'
import { buildActionEntryUrl } from '../../services/homeRailNavigation.service'
import { parseSettingsRouteQuery } from '../../services/routeQuery.service'
import { createSettingsContentShell, resolveSettingsContent } from '../../services/settingsContent.service'
import type { SettingItem, SettingsSummary, SettingSection } from '../../models/settings.model'
import HomeInteractiveTarget from '../home/components/HomeInteractiveTarget.vue'

const content = createSettingsContentShell('', '')
const summary = reactive<SettingsSummary>({ ...content.summary })
const sections = ref<SettingSection[]>(content.sections)

const settingIconMap: Record<string, Component> = {
  'account-info': UserRound,
  'security-center': ShieldCheck,
  'wallet-manage': Wallet,
  'notice-setting': BellRing,
  'appearance-setting': Paintbrush,
  'language-region': Languages,
}

const resolveSettingIcon = (itemId: string) => {
  return settingIconMap[itemId] ?? ShieldCheck
}

onLoad((query) => {
  const routeQuery = parseSettingsRouteQuery(query as Record<string, unknown>)
  const { source, section } = routeQuery

  const shellContent = createSettingsContentShell(source, section)
  Object.assign(summary, shellContent.summary)
  sections.value = shellContent.sections

  void resolveSettingsContent(source, section)
    .then((nextContent) => {
      Object.assign(summary, nextContent.summary)
      sections.value = nextContent.sections
    })
    .catch((error) => {
      console.error('[settings] failed to hydrate content scene', error)
    })
})

const handleSummaryActionClick = () => {
  if (!summary.actionTarget) {
    return
  }

  uni.navigateTo({
    url: buildActionEntryUrl(summary.actionTarget, 'settings-feedback'),
  })
}

const handleSettingItemClick = (item: SettingItem) => {
  if (!item.target) {
    return
  }

  uni.navigateTo({
    url: buildActionEntryUrl(item.target, 'settings-item'),
  })
}

const handleLogoutClick = () => {
  uni.navigateTo({
    url: buildActionEntryUrl(
      {
        targetType: 'settings_action',
        targetId: 'logout',
      },
      'settings-logout',
    ),
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
.settings-page {
  width: 100%;
  min-height: 100dvh;
  background:
    radial-gradient(circle at top right, rgba(34, 211, 238, 0.08), transparent 34%),
    linear-gradient(180deg, #fafafa 0%, #f4f5f7 100%);
}

.settings-scroll {
  height: 100dvh;
}

.settings-flow {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100%;
  padding: 16px 16px 32px;
  box-sizing: border-box;
}

.settings-header {
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
}

.settings-back-entry,
.settings-menu-entry,
.settings-header-spacer {
  width: 44px;
  height: 44px;
}

.settings-back-entry,
.settings-menu-entry {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111111;
}

.settings-header-copy,
.settings-section-head {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
}

.settings-header-title,
.settings-section-title {
  font-size: 20px;
  line-height: 28px;
  font-weight: 900;
  color: #111111;
}

.settings-header-subtitle,
.settings-section-subtitle,
.settings-summary-title-sub,
.settings-summary-eyebrow,
.settings-summary-action-sub {
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

.settings-summary-card {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  padding: 24px;
  background: linear-gradient(180deg, #0f172a 0%, #111827 100%);
  color: #ffffff;
}

.settings-summary-glow {
  position: absolute;
  right: -48px;
  top: -48px;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  background: rgba(34, 211, 238, 0.34);
  filter: blur(48px);
}

.settings-summary-eyebrow-row,
.settings-summary-title-row,
.settings-summary-desc,
.settings-summary-action {
  position: relative;
  z-index: 1;
}

.settings-summary-eyebrow-row,
.settings-summary-title-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.settings-summary-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #22d3ee;
}

.settings-summary-title-row {
  margin-top: 12px;
}

.settings-summary-title {
  font-size: 24px;
  line-height: 32px;
  font-weight: 900;
}

.settings-summary-desc {
  margin-top: 12px;
  font-size: 14px;
  line-height: 24px;
  color: rgba(255, 255, 255, 0.78);
}

.settings-summary-action {
  margin-top: 20px;
}

.settings-summary-action-pill,
.settings-logout-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.settings-summary-action-main,
.settings-logout-text {
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
}

.settings-section-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-section-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.settings-section-card {
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 0 24px rgba(15, 23, 42, 0.05);
}

.settings-item-entry {
  min-height: 72px;
  padding: 20px;
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
  box-sizing: border-box;
}

.settings-item-entry.has-divider {
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}

.settings-item-icon-wrap,
.settings-item-meta {
  color: #64748b;
}

.settings-item-title {
  font-size: 15px;
  line-height: 22px;
  font-weight: 800;
  color: #111111;
}

.settings-item-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.settings-item-value {
  font-size: 12px;
  line-height: 12px;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.settings-logout-entry {
  align-self: center;
}

.settings-logout-pill {
  background: #111111;
}
</style>

