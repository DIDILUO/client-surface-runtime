<template>
  <StandalonePageScaffold route-source="profile-address-page">
    <template #default="{ canOpenDrawer, openDrawer }">
      <view class="profile-address-page">
        <scroll-view class="profile-address-scroll" scroll-y>
          <view class="profile-address-flow">
            <view class="profile-address-header">
              <HomeInteractiveTarget
                class="profile-address-back-entry"
                interaction-mode="compact"
                label="返回上一页"
                @activate="handleBack"
              >
                <ArrowLeft :size="20" :stroke-width="1.9" />
              </HomeInteractiveTarget>

              <view class="profile-address-header-copy">
                <text class="profile-address-header-title">地址二维码</text>
                <text class="profile-address-header-subtitle">ADDRESS QR</text>
              </view>

              <HomeInteractiveTarget
                v-if="canOpenDrawer"
                class="profile-address-menu-entry"
                interaction-mode="compact"
                label="打开更多服务"
                @activate="openDrawer"
              >
                <Menu :size="20" :stroke-width="1.9" />
              </HomeInteractiveTarget>
              <view v-else class="profile-address-header-spacer" aria-hidden="true" />
            </view>

            <view class="profile-address-hero-card">
              <view class="profile-address-hero-copy">
                <view class="profile-address-badge-row">
                  <view class="profile-address-status-pill">
                    <text class="profile-address-status-pill-text">{{ content.statusLabel }}</text>
                  </view>
                  <view class="profile-address-network-pill">
                    <text class="profile-address-network-pill-text">{{ content.networkLabel }}</text>
                  </view>
                </view>

                <text class="profile-address-name">{{ content.displayName }}</text>
                <text class="profile-address-address">{{ content.address }}</text>
                <text class="profile-address-summary">{{ content.summary }}</text>

                <HomeInteractiveTarget
                  class="profile-address-copy-entry"
                  interaction-mode="compact"
                  label="复制钱包地址"
                  @activate="handleCopyAddress"
                >
                  <view class="profile-address-copy-visual">
                    <Copy :size="16" :stroke-width="1.9" />
                    <text class="profile-address-copy-text">复制地址</text>
                  </view>
                </HomeInteractiveTarget>
              </view>

              <view class="profile-address-qr-stage">
                <view class="profile-address-qr-decor" aria-hidden="true" />
                <view class="profile-address-qr-board">
                  <view class="profile-address-qr-grid">
                    <view
                      v-for="cell in qrCells"
                      :key="cell.id"
                      class="profile-address-qr-cell"
                      :class="{ 'is-dark': cell.filled }"
                    />
                  </view>

                  <view class="profile-address-qr-icon-shell">
                    <QrCode :size="18" :stroke-width="1.8" />
                  </view>
                </view>
              </view>
            </view>

            <view class="profile-address-note-card">
              <view class="profile-address-note-head">
                <text class="profile-address-note-title">使用说明</text>
                <text class="profile-address-note-subtitle">GUIDE</text>
              </view>

              <view class="profile-address-note-list">
                <view class="profile-address-note-item">
                  <view class="profile-address-note-dot" />
                  <text class="profile-address-note-text">当前地址用于承接个人中心资产、首发藏品归属和后续服务动作。</text>
                </view>
                <view class="profile-address-note-item">
                  <view class="profile-address-note-dot" />
                  <text class="profile-address-note-text">后续接真实桥接能力时，此页直接替换成真实二维码生成与分享链路。</text>
                </view>
                <view class="profile-address-note-item">
                  <view class="profile-address-note-dot" />
                  <text class="profile-address-note-text">当前阶段先保证地址可查看、可复制、可从个人中心稳定进入。</text>
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
import { ArrowLeft, Copy, Menu, QrCode } from 'lucide-vue-next'
import StandalonePageScaffold from '../../components/StandalonePageScaffold.vue'
import type { ProfileAddressContent } from '../../models/profileAddress.model'
import { createProfileAddressContentShell, resolveProfileAddressContent } from '../../services/profileAddressContent.service'
import { parseProfileAddressRouteQuery } from '../../services/routeQuery.service'
import HomeInteractiveTarget from '../home/components/HomeInteractiveTarget.vue'

interface QrCell {
  id: string
  filled: boolean
}

const content = reactive<ProfileAddressContent>(createProfileAddressContentShell())

const buildQrCells = (seed: string): QrCell[] => {
  const normalized = (seed || 'AETHER-ADDRESS').trim()
  const size = 21
  let hash = 0

  for (let index = 0; index < normalized.length; index += 1) {
    hash = (hash * 131 + normalized.charCodeAt(index)) % 1000003
  }

  const isFinderCell = (x: number, y: number) => {
    const inTopLeft = x <= 6 && y <= 6
    const inTopRight = x >= size - 7 && y <= 6
    const inBottomLeft = x <= 6 && y >= size - 7
    return inTopLeft || inTopRight || inBottomLeft
  }

  const isFinderDark = (x: number, y: number) => {
    const normalizeX = x >= size - 7 ? x - (size - 7) : x
    const normalizeY = y >= size - 7 ? y - (size - 7) : y
    const isOuter = normalizeX === 0 || normalizeX === 6 || normalizeY === 0 || normalizeY === 6
    const isInner = normalizeX >= 2 && normalizeX <= 4 && normalizeY >= 2 && normalizeY <= 4
    return isOuter || isInner
  }

  const cells: QrCell[] = []

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (isFinderCell(x, y)) {
        cells.push({
          id: `${x}-${y}`,
          filled: isFinderDark(x, y),
        })
        continue
      }

      const score = (hash + x * 37 + y * 57 + x * y * 11) % 19
      cells.push({
        id: `${x}-${y}`,
        filled: score <= 8,
      })
    }
  }

  return cells
}

const qrCells = computed(() => buildQrCells(content.address))

const applyContent = (nextContent: ProfileAddressContent) => {
  Object.assign(content, nextContent)
}

onLoad((query) => {
  parseProfileAddressRouteQuery(query as Record<string, unknown>)

  void resolveProfileAddressContent()
    .then((nextContent) => {
      applyContent(nextContent)
    })
    .catch((error) => {
      console.error('[profile-address] failed to hydrate address content', error)
    })
})

const handleCopyAddress = () => {
  uni.setClipboardData({
    data: content.address,
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
.profile-address-page {
  width: 100%;
  min-height: 100dvh;
  background:
    radial-gradient(circle at top right, rgba(34, 211, 238, 0.08), transparent 36%),
    linear-gradient(180deg, #fafafa 0%, #f4f5f7 100%);
}

.profile-address-scroll {
  height: 100dvh;
}

.profile-address-flow {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100%;
  padding: 16px 16px 32px;
  box-sizing: border-box;
}

.profile-address-header {
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
}

.profile-address-back-entry,
.profile-address-menu-entry,
.profile-address-header-spacer {
  width: 44px;
  height: 44px;
}

.profile-address-back-entry,
.profile-address-menu-entry {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111827;
}

.profile-address-header-copy {
  min-width: 0;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
}

.profile-address-header-title {
  color: #111111;
  font-size: 20px;
  line-height: 28px;
  font-weight: 900;
}

.profile-address-header-subtitle {
  color: #22d3ee;
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transform: scale(0.75);
  transform-origin: left bottom;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.profile-address-hero-card,
.profile-address-note-card {
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 0 28px rgba(15, 23, 42, 0.06);
}

.profile-address-hero-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 152px;
  gap: 16px;
  padding: 20px;
}

.profile-address-hero-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profile-address-badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.profile-address-status-pill,
.profile-address-network-pill {
  min-height: 24px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
}

.profile-address-status-pill {
  background: rgba(236, 254, 255, 0.98);
  color: #0891b2;
}

.profile-address-network-pill {
  background: #f4f5f7;
  color: #64748b;
}

.profile-address-status-pill-text,
.profile-address-network-pill-text {
  font-size: 12px;
  line-height: 12px;
  font-weight: 700;
}

.profile-address-name {
  color: #111111;
  font-size: 20px;
  line-height: 24px;
  font-weight: 900;
}

.profile-address-address {
  color: #334155;
  font-size: 13px;
  line-height: 20px;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.profile-address-summary {
  color: #64748b;
  font-size: 14px;
  line-height: 24px;
}

.profile-address-copy-entry {
  width: fit-content;
}

.profile-address-copy-visual {
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  background: #111111;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.profile-address-copy-text {
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
}

.profile-address-qr-stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-address-qr-decor {
  position: absolute;
  inset: -8px;
  opacity: 0.72;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 9px, rgba(15, 23, 42, 0.04) 9px, rgba(15, 23, 42, 0.04) 10px),
    repeating-linear-gradient(90deg, transparent, transparent 9px, rgba(15, 23, 42, 0.04) 9px, rgba(15, 23, 42, 0.04) 10px);
  -webkit-mask-image: radial-gradient(circle at center, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.46) 46%, transparent 84%);
  mask-image: radial-gradient(circle at center, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.46) 46%, transparent 84%);
  pointer-events: none;
}

.profile-address-qr-board {
  position: relative;
  z-index: 1;
  width: 152px;
  height: 152px;
  padding: 12px;
  border-radius: 24px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 0 18px rgba(15, 23, 42, 0.05);
}

.profile-address-qr-grid {
  display: grid;
  grid-template-columns: repeat(21, 1fr);
  grid-template-rows: repeat(21, 1fr);
  gap: 2px;
  width: 100%;
  height: 100%;
}

.profile-address-qr-cell {
  border-radius: 2px;
  background: rgba(148, 163, 184, 0.14);
}

.profile-address-qr-cell.is-dark {
  background: #111827;
}

.profile-address-qr-icon-shell {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 0 10px rgba(15, 23, 42, 0.08);
  color: #111111;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-address-note-card {
  padding: 20px;
}

.profile-address-note-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.profile-address-note-title {
  color: #111111;
  font-size: 20px;
  line-height: 24px;
  font-weight: 900;
}

.profile-address-note-subtitle {
  color: #22d3ee;
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  letter-spacing: 0.14em;
  transform: scale(0.75);
  transform-origin: left bottom;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.profile-address-note-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profile-address-note-item {
  display: grid;
  grid-template-columns: 8px 1fr;
  gap: 8px;
  align-items: start;
}

.profile-address-note-dot {
  width: 6px;
  height: 6px;
  margin-top: 9px;
  border-radius: 999px;
  background: #22d3ee;
}

.profile-address-note-text {
  color: #475569;
  font-size: 14px;
  line-height: 24px;
}
</style>

