<template>
  <view class="home-activity-panel">
    <view class="home-activity-header">
      <view class="home-activity-header-title-group">
        <text class="home-activity-header-title">发现活动</text>
        <text class="home-activity-header-subtitle">EVENTS</text>
      </view>
    </view>

    <view class="home-activity-entry-stack">
      <view class="home-activity-entry-grid">
        <HomeInteractiveTarget
          v-if="assetMergeEntry"
          class="home-activity-entry home-activity-entry-lead"
          :label="`查看 ${assetMergeEntry.title}`"
          @activate="handleEntryClick(assetMergeEntry)"
        >
          <view class="home-activity-entry-layer home-activity-entry-layer-dark">
            <view class="home-activity-entry-eyebrow">{{ assetMergeEntry.eyebrow }}</view>
            <view class="home-activity-entry-copy">
              <text class="home-activity-entry-title home-activity-entry-title-light">{{ assetMergeEntry.title }}</text>
              <text class="home-activity-entry-desc home-activity-entry-desc-light">{{ assetMergeEntry.description }}</text>
            </view>
          </view>
        </HomeInteractiveTarget>

        <HomeInteractiveTarget
          v-if="priorityDrawEntry"
          class="home-activity-entry home-activity-entry-side"
          :label="`查看 ${priorityDrawEntry.title}`"
          @activate="handleEntryClick(priorityDrawEntry)"
        >
          <view class="home-activity-entry-layer home-activity-entry-layer-light">
            <view class="home-activity-entry-side-icon">
              <Award :size="16" :stroke-width="1.8" />
            </view>
            <view class="home-activity-entry-copy is-compact">
              <text class="home-activity-entry-title">{{ priorityDrawEntry.title }}</text>
              <text class="home-activity-entry-desc">{{ priorityDrawEntry.description }}</text>
            </view>
          </view>
        </HomeInteractiveTarget>
      </view>

      <HomeInteractiveTarget
        v-if="networkInviteEntry"
        class="home-activity-entry home-activity-entry-inline"
        :label="`查看 ${networkInviteEntry.title}`"
        @activate="handleEntryClick(networkInviteEntry)"
      >
        <view class="home-activity-entry-inline-bar" />
        <view class="home-activity-entry-copy is-inline">
          <text class="home-activity-entry-title">{{ networkInviteEntry.title }}</text>
          <text class="home-activity-entry-desc">{{ networkInviteEntry.description }}</text>
        </view>
        <view class="home-activity-entry-inline-icon">
          <Users :size="16" :stroke-width="1.8" />
        </view>
      </HomeInteractiveTarget>
    </view>

    <view class="home-activity-notice-stack">
      <view class="home-activity-section-head">
        <view class="home-activity-section-title-group">
          <text class="home-activity-section-title">系统公告</text>
          <text class="home-activity-section-subtitle">UPDATES</text>
        </view>
      </view>

      <view class="home-activity-tag-wrap">
        <scroll-view class="home-activity-tag-scroll" scroll-x :show-scrollbar="false">
          <view class="home-activity-tag-track">
            <HomeInteractiveTarget
              v-for="tag in noticeTags"
              :key="tag"
              class="home-activity-tag-entry"
              interaction-mode="compact"
              :selected="activeTag === tag"
              :class="{ 'is-active': activeTag === tag }"
              :label="`筛选 ${tag}`"
              @activate="handleTagSelect(tag)"
            >
              <text class="home-activity-tag-text">{{ tag }}</text>
            </HomeInteractiveTarget>
          </view>
        </scroll-view>
        <view class="home-activity-tag-fade-right" />
      </view>

      <view class="home-activity-notice-list">
        <HomeInteractiveTarget
          v-for="notice in filteredNotices"
          :key="notice.id"
          class="home-activity-notice-entry"
          :label="`查看 ${notice.title}`"
          @activate="handleNoticeClick(notice)"
        >
          <view class="home-activity-notice-icon-wrap" :class="`tone-${resolveNoticeTone(notice.type)}`">
            <component :is="resolveNoticeIcon(notice.type)" :size="18" :stroke-width="1.8" />
          </view>

          <view class="home-activity-notice-copy">
            <text class="home-activity-notice-title">{{ notice.title }}</text>
            <view class="home-activity-notice-meta">
              <view class="home-activity-notice-type-pill" :class="`tone-${resolveNoticeTone(notice.type)}`">
                <text class="home-activity-notice-type-text">{{ notice.type }}</text>
              </view>
              <text class="home-activity-notice-time">{{ notice.time }}</text>
            </view>
          </view>
        </HomeInteractiveTarget>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Award, Bell, Megaphone, ShieldAlert, Users, Wrench } from 'lucide-vue-next'
import type { Component } from 'vue'
import HomeInteractiveTarget from './HomeInteractiveTarget.vue'
import { createHomeRailActivityContentShell, resolveHomeRailActivityContent } from '../../../services/homeRailActivityContent.service'
import { buildActivityNoticeDetailUrl, buildContentResourceUrl } from '../../../services/homeRailNavigation.service'
import type { ActivityEntry, ActivityNotice, ActivityNoticeType, HomeRailActivityContent } from '../../../models/homeRailActivity.model'

const activityContent = ref<HomeRailActivityContent>(createHomeRailActivityContentShell())
const activeTag = ref(activityContent.value.notices.tags[0] ?? '全部')

const syncActiveTag = () => {
  const tags = activityContent.value.notices.tags
  if (!tags.length) {
    activeTag.value = '全部'
    return
  }

  if (!tags.includes(activeTag.value)) {
    activeTag.value = tags[0]
  }
}

const assetMergeEntry = computed(() => activityContent.value.entries.find((entry) => entry.id === 'asset-merge'))
const priorityDrawEntry = computed(() => activityContent.value.entries.find((entry) => entry.id === 'priority-draw'))
const networkInviteEntry = computed(() => activityContent.value.entries.find((entry) => entry.id === 'network-invite'))
const noticeTags = computed(() => activityContent.value.notices.tags)

const filteredNotices = computed(() => {
  const currentTag = activeTag.value
  if (!currentTag || currentTag === '全部') {
    return activityContent.value.notices.list
  }

  return activityContent.value.notices.list.filter((notice) => notice.type === currentTag)
})

const NOTICE_ICON_MAP: Record<ActivityNoticeType, Component> = {
  系统更新: Bell,
  活动预告: Megaphone,
  维护通知: Wrench,
  安全警报: ShieldAlert,
  社区动态: Users,
}

const NOTICE_TONE_MAP: Record<ActivityNoticeType, 'cyan' | 'violet' | 'amber' | 'rose' | 'slate'> = {
  系统更新: 'cyan',
  活动预告: 'violet',
  维护通知: 'amber',
  安全警报: 'rose',
  社区动态: 'slate',
}

const resolveNoticeIcon = (type: ActivityNoticeType) => {
  return NOTICE_ICON_MAP[type] ?? Bell
}

const resolveNoticeTone = (type: ActivityNoticeType) => {
  return NOTICE_TONE_MAP[type] ?? 'slate'
}

const handleTagSelect = (tag: string) => {
  activeTag.value = tag
}

const handleEntryClick = (entry: ActivityEntry) => {
  uni.navigateTo({
    url: buildContentResourceUrl(entry.target, 'activity-entry'),
  })
}

const handleNoticeClick = (notice: ActivityNotice) => {
  uni.navigateTo({
    url: buildActivityNoticeDetailUrl(notice),
  })
}

onMounted(async () => {
  try {
    activityContent.value = await resolveHomeRailActivityContent()
  } catch (error) {
    console.error('[homeRail] failed to resolve activity scene content', error)
    activityContent.value = createHomeRailActivityContentShell()
  } finally {
    syncActiveTag()
  }
})
</script>
<style lang="scss" scoped>
.home-activity-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0 var(--home-page-inline-padding, 16px);
  box-sizing: border-box;
  background: #fafafa;
}

.home-activity-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.home-activity-header-title-group,
.home-activity-section-title-group {
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.home-activity-header-title,
.home-activity-section-title {
  font-size: 20px;
  line-height: 24px;
  font-weight: 900;
  color: #111111;
}

.home-activity-header-subtitle,
.home-activity-section-subtitle {
  min-height: 12px;
  display: inline-block;
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  color: #22d3ee;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  transform: scale(0.75);
  transform-origin: left bottom;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.home-activity-entry-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.home-activity-entry-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: 12px;
}

.home-activity-entry {
  display: block;
}

.home-activity-entry-lead,
.home-activity-entry-side,
.home-activity-entry-inline,
.home-activity-notice-entry {
  transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .home-activity-entry-lead:hover,
  .home-activity-entry-side:hover,
  .home-activity-entry-inline:hover,
  .home-activity-notice-entry:hover {
    transform: translateY(-2px);
  }
}

.home-activity-entry-layer {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 140px;
  border-radius: 20px;
  overflow: hidden;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.home-activity-entry-layer-dark {
  background:
    radial-gradient(circle at 88% 18%, rgba(34, 211, 238, 0.18), transparent 30%),
    linear-gradient(180deg, #111827 0%, #0f172a 100%);
  box-shadow: var(--aether-shadow-soft, 0 0 24px rgba(15, 23, 42, 0.06));
}

.home-activity-entry-layer-light {
  background:
    radial-gradient(circle at 84% 88%, rgba(34, 211, 238, 0.12), transparent 28%),
    linear-gradient(180deg, #ffffff 0%, #f4f5f7 100%);
  border: 1px solid #eef2f7;
  box-shadow: var(--aether-shadow-soft, 0 0 24px rgba(15, 23, 42, 0.06));
}

.home-activity-entry-eyebrow {
  min-height: 20px;
  width: max-content;
  border-radius: 999px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  font-size: 12px;
  line-height: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.82);
  transform-origin: left center;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.home-activity-entry-copy {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.home-activity-entry-copy.is-compact {
  gap: 8px;
}

.home-activity-entry-copy.is-inline {
  min-width: 0;
  flex: 1 1 auto;
}

.home-activity-entry-title {
  font-size: 15px;
  line-height: 20px;
  font-weight: 800;
  color: #111111;
}

.home-activity-entry-title-light {
  color: #ffffff;
}

.home-activity-entry-desc {
  font-size: 12px;
  line-height: 18px;
  color: #64748b;
}

.home-activity-entry-desc-light {
  color: rgba(226, 232, 240, 0.7);
}

.home-activity-entry-side-icon {
  width: 32px;
  height: 32px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.76);
  color: #475569;
}

.home-activity-entry-inline {
  position: relative;
  min-height: 84px;
  border-radius: 20px;
  border: 1px solid #eef2f7;
  background: linear-gradient(135deg, #f6fbfc 0%, #ffffff 78%);
  box-shadow: var(--aether-shadow-soft, 0 0 24px rgba(15, 23, 42, 0.06));
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
}

.home-activity-entry-inline-bar {
  width: 2px;
  align-self: stretch;
  border-radius: 999px;
  background: rgba(34, 211, 238, 0.72);
  flex-shrink: 0;
}

.home-activity-entry-inline-icon {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  color: #06b6d4;
  box-shadow: var(--aether-shadow-soft-xs, 0 0 16px rgba(15, 23, 42, 0.04));
  flex-shrink: 0;
}

.home-activity-notice-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.home-activity-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.home-activity-tag-wrap {
  position: relative;
}

.home-activity-tag-scroll {
  width: 100%;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.home-activity-tag-scroll::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.home-activity-tag-track {
  display: flex;
  align-items: center;
  gap: 8px;
  width: max-content;
  padding-right: 24px;
  box-sizing: border-box;
}

.home-activity-tag-entry {
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: #f4f5f7;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 180ms ease, transform 180ms ease;
}

.home-activity-tag-entry.is-active {
  background: #111111;
}

.home-activity-tag-text {
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
  color: #9ca3af;
  transition: color 180ms ease;
}

.home-activity-tag-entry.is-active .home-activity-tag-text {
  color: #ffffff;
}

.home-activity-tag-fade-right {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 24px;
  pointer-events: none;
  background: linear-gradient(270deg, #fafafa 0%, rgba(250, 250, 250, 0) 100%);
}

.home-activity-notice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.home-activity-notice-entry {
  min-height: 84px;
  border-radius: 20px;
  border: 1px solid #eef2f7;
  background: #ffffff;
  box-shadow: var(--aether-shadow-soft, 0 0 24px rgba(15, 23, 42, 0.06));
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.home-activity-notice-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.home-activity-notice-icon-wrap.tone-cyan {
  background: rgba(34, 211, 238, 0.12);
  color: #06b6d4;
}

.home-activity-notice-icon-wrap.tone-violet {
  background: rgba(139, 92, 246, 0.12);
  color: #8b5cf6;
}

.home-activity-notice-icon-wrap.tone-amber {
  background: rgba(245, 158, 11, 0.12);
  color: #d97706;
}

.home-activity-notice-icon-wrap.tone-rose {
  background: rgba(244, 63, 94, 0.12);
  color: #e11d48;
}

.home-activity-notice-icon-wrap.tone-slate {
  background: rgba(148, 163, 184, 0.14);
  color: #64748b;
}

.home-activity-notice-copy {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.home-activity-notice-title {
  font-size: 13px;
  line-height: 20px;
  font-weight: 700;
  color: #111111;
}

.home-activity-notice-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.home-activity-notice-type-pill {
  min-height: 20px;
  border-radius: 999px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.home-activity-notice-type-pill.tone-cyan {
  background: rgba(34, 211, 238, 0.12);
}

.home-activity-notice-type-pill.tone-violet {
  background: rgba(139, 92, 246, 0.12);
}

.home-activity-notice-type-pill.tone-amber {
  background: rgba(245, 158, 11, 0.12);
}

.home-activity-notice-type-pill.tone-rose {
  background: rgba(244, 63, 94, 0.12);
}

.home-activity-notice-type-pill.tone-slate {
  background: rgba(148, 163, 184, 0.14);
}

.home-activity-notice-type-text,
.home-activity-notice-time {
  font-size: 12px;
  line-height: 12px;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.home-activity-notice-type-text {
  color: #475569;
}

.home-activity-notice-time {
  color: #9ca3af;
}
</style>

