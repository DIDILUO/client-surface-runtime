<!--
文件版本：v0008
更新时间：2026-03-25 20:20:00
Encoding: UTF-8
本次更新：更新中页改为旧架构施工占位口径，并按截图重写为浅色中心施工卡样式
-->

<template>
  <view class="updating-page">
    <view class="updating-shell">
      <view class="updating-header">
        <view class="updating-back-hit" hover-class="is-hit-active" @tap="handleBack">
          <ArrowLeft :size="20" :stroke-width="2" />
        </view>
        <view class="updating-header-copy">
          <text class="updating-header-title">{{ page.title }}</text>
          <text class="updating-header-subtitle">{{ page.englishTitle }}</text>
        </view>
        <view class="updating-header-placeholder" />
      </view>

      <view class="updating-main-panel">
        <view class="updating-icon-wrap">
          <view class="updating-icon-shell">
            <TerminalSquare class="updating-icon-main" :size="36" :stroke-width="1.3" />
            <view class="updating-loader-dot">
              <Loader2 :size="14" class="updating-loader-icon" :stroke-width="2.2" />
            </view>
          </view>
        </view>

        <view class="updating-copy-block">
          <text class="updating-panel-title">系统模块构建中</text>
          <text class="updating-status-line">{{ resolvedStatusLabel }}</text>
          <text class="updating-desc">{{ page.description }}</text>
          <text class="updating-reserve">{{ page.reserveHint }}</text>
        </view>

        <view class="updating-footer">
          <view class="updating-return-hit" hover-class="is-hit-active" @tap="handleBack">
            <ArrowLeft :size="16" :stroke-width="2.2" />
            <text class="updating-return-copy">返回上一级</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { ArrowLeft, Loader2, TerminalSquare } from 'lucide-vue-next'
import { parseUpdatingRouteQuery } from '../../services/routeQuery.service'
import { resolveUpdatingContent } from '../../services/pagePlaceholderContent.service'

const defaultPage = {
  title: '首发藏品详情',
  englishTitle: 'Drop Detail',
  statusLabel: 'SYNCING_DATA',
  moduleId: 'UPD-001',
  description: '当前入口已完成路由保留，铸造与状态回执链路正在联调。',
  reserveHint: '正式页面上线后将直接替换当前占位，不会改变现有入口路径。',
}

const page = reactive({ ...defaultPage })

const resolvedStatusLabel = computed(() => {
  const normalized = page.statusLabel.trim()
  if (!normalized) {
    return 'STATUS: SYNCING_DATA'
  }
  return normalized.toUpperCase().startsWith('STATUS:') ? normalized.toUpperCase() : `STATUS: ${normalized.toUpperCase()}`
})

onLoad((query) => {
  const routeQuery = parseUpdatingRouteQuery(query as Record<string, unknown>)
  const { moduleId, title, englishTitle, statusLabel, source } = routeQuery

  page.moduleId = moduleId || defaultPage.moduleId
  page.title = title || defaultPage.title
  page.englishTitle = englishTitle || defaultPage.englishTitle
  page.statusLabel = statusLabel || defaultPage.statusLabel

  const resolvedContent = resolveUpdatingContent(page.moduleId, source)
  page.description = resolvedContent.description
  page.reserveHint = resolvedContent.reserveHint
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
.updating-page {
  width: 100%;
  min-height: 100dvh;
  background: #fafafa;
}

.updating-shell {
  min-height: 100dvh;
  padding: calc(var(--status-bar-height, 0px) + 8px) 16px calc(32px + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.updating-header {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.updating-back-hit {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111111;
}

.updating-header-placeholder {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
}

.updating-header-copy {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
}

.updating-header-title {
  font-size: 32rpx;
  line-height: 40rpx;
  font-weight: 800;
  color: #111111;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.updating-header-subtitle {
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

.updating-main-panel {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 48px;
  box-sizing: border-box;
}

.updating-icon-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.updating-icon-shell {
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 24px;
  border: 1px solid #f1f5f9;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 28px rgba(15, 23, 42, 0.05);
}

.updating-icon-main {
  color: #cbd5e1;
}

.updating-loader-dot {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.updating-loader-icon {
  color: #22d3ee;
  animation: updating-spin 960ms linear infinite;
}

.updating-copy-block {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.updating-panel-title {
  font-size: 36rpx;
  line-height: 44rpx;
  font-weight: 900;
  color: #111111;
}

.updating-status-line {
  font-size: 12px;
  line-height: 12px;
  color: #22d3ee;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-family: var(--aether-font-system, system-ui, sans-serif);
  transform: scale(0.83);
  transform-origin: center center;
}

.updating-desc,
.updating-reserve {
  width: 100%;
  font-size: 12px;
  line-height: 20px;
  color: #94a3b8;
  text-align: center;
}

.updating-reserve {
  margin-top: -4px;
}

.updating-footer {
  margin-top: 28px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.updating-return-hit {
  min-width: 128px;
  min-height: 44px;
  border-radius: 999px;
  padding: 0 20px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #ffffff;
  background: #111111;
  box-shadow: 0 0 20px rgba(15, 23, 42, 0.12);
}

.updating-return-copy {
  font-size: 12px;
  line-height: 16px;
  font-weight: 800;
  color: #ffffff;
}

.is-hit-active {
  transform: scale(0.98);
}

@keyframes updating-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>

