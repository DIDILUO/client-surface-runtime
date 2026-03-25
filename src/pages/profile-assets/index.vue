<template>
  <StandalonePageScaffold route-source="profile-assets-page">
    <template #default="{ canOpenDrawer, openDrawer }">
      <view class="profile-assets-page">
        <scroll-view class="profile-assets-scroll" scroll-y>
          <view class="profile-assets-flow">
            <view class="profile-assets-header">
              <HomeInteractiveTarget
                class="profile-assets-back-entry"
                interaction-mode="compact"
                label="返回上一页"
                @activate="handleBack"
              >
                <ArrowLeft :size="20" :stroke-width="1.9" />
              </HomeInteractiveTarget>

              <view class="profile-assets-header-copy">
                <text class="profile-assets-header-title">我的藏品搜索</text>
                <text class="profile-assets-header-subtitle">ASSET SEARCH</text>
              </view>

              <HomeInteractiveTarget
                v-if="canOpenDrawer"
                class="profile-assets-menu-entry"
                interaction-mode="compact"
                label="打开更多服务"
                @activate="openDrawer"
              >
                <Menu :size="20" :stroke-width="1.9" />
              </HomeInteractiveTarget>
              <view v-else class="profile-assets-header-spacer" aria-hidden="true" />
            </view>

            <view class="profile-assets-search-card">
              <view class="profile-assets-search-shell">
                <Search :size="18" :stroke-width="1.8" />
                <input
                  class="profile-assets-search-input"
                  :value="keyword"
                  placeholder="搜索藏品名称 / 资产 ID"
                  confirm-type="search"
                  @input="handleKeywordInput"
                />
              </view>

              <text class="profile-assets-result-meta">当前结果 {{ content.total }} 项</text>
            </view>

            <view class="profile-assets-category-wrap">
              <scroll-view class="profile-assets-category-scroll" scroll-x :show-scrollbar="false">
                <view class="profile-assets-category-track">
                  <HomeInteractiveTarget
                    v-for="category in content.categories"
                    :key="category.id"
                    class="profile-assets-category-entry"
                    interaction-mode="compact"
                    :selected="activeCategory === category.id"
                    :class="{ 'is-active': activeCategory === category.id }"
                    :label="`切换到${category.label}`"
                    @activate="handleCategoryChange(category.id)"
                  >
                    <text class="profile-assets-category-text">{{ category.label }}</text>
                  </HomeInteractiveTarget>
                </view>
              </scroll-view>
              <view class="profile-assets-category-fade-right" />
            </view>

            <view class="profile-assets-grid" v-if="content.items.length">
              <HomeInteractiveTarget
                v-for="item in content.items"
                :key="item.id"
                class="profile-assets-entry"
                :label="`查看 ${item.title}`"
                @activate="handleAssetClick(item)"
              >
                <view class="profile-assets-entry-visual">
                  <view class="profile-assets-entry-type">{{ item.subCategory }}</view>
                  <view class="profile-assets-entry-canvas">
                    <component :is="resolveAssetIcon(item.categoryId)" :size="28" :stroke-width="1.4" />
                  </view>
                  <text class="profile-assets-entry-id">{{ item.id }}</text>
                </view>

                <view class="profile-assets-entry-copy">
                  <text class="profile-assets-entry-title">{{ item.title }}</text>
                  <view class="profile-assets-entry-meta">
                    <text class="profile-assets-entry-category">{{ item.categoryLabel }}</text>
                    <text class="profile-assets-entry-date">{{ item.acquiredAt }}</text>
                  </view>
                </view>
              </HomeInteractiveTarget>
            </view>

            <view v-else class="profile-assets-empty-card">
              <Search :size="28" :stroke-width="1.4" />
              <text class="profile-assets-empty-title">当前筛选下暂无资产</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </template>
  </StandalonePageScaffold>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { ArrowLeft, Box, Menu, Package, Search, Shield } from 'lucide-vue-next'
import type { Component } from 'vue'
import StandalonePageScaffold from '../../components/StandalonePageScaffold.vue'
import type { ProfileCategoryKey } from '../../models/homeRailProfile.model'
import type { ProfileAssetSearchCategoryId, ProfileAssetSearchContent, ProfileAssetSearchItem } from '../../models/profileAssetSearch.model'
import { buildProfileAssetDetailUrl } from '../../services/homeRailNavigation.service'
import { createProfileAssetSearchShell, resolveProfileAssetSearchList } from '../../services/profileAssetSearchContent.service'
import { parseProfileAssetsRouteQuery } from '../../services/routeQuery.service'
import HomeInteractiveTarget from '../home/components/HomeInteractiveTarget.vue'

const content = reactive<ProfileAssetSearchContent>(createProfileAssetSearchShell())
const activeCategory = ref<ProfileAssetSearchCategoryId>('all')
const keyword = ref('')
const isLoading = ref(false)

const resolveAssetIcon = (categoryId: ProfileCategoryKey): Component => {
  if (categoryId === 'blindBoxes') {
    return Package
  }

  if (categoryId === 'certificates') {
    return Shield
  }

  return Box
}

const applyContent = (nextContent: ProfileAssetSearchContent) => {
  Object.assign(content, {
    categories: nextContent.categories.map((item) => ({ ...item })),
    items: nextContent.items.map((item) => ({ ...item })),
    total: nextContent.total,
  })
}

const refreshList = async () => {
  isLoading.value = true

  try {
    const nextContent = await resolveProfileAssetSearchList({
      categoryId: activeCategory.value,
      keyword: keyword.value,
    })
    applyContent(nextContent)
  } catch (error) {
    console.error('[profile-assets] failed to hydrate asset search list', error)
  } finally {
    isLoading.value = false
  }
}

onLoad((query) => {
  const routeQuery = parseProfileAssetsRouteQuery(query as Record<string, unknown>)
  activeCategory.value = (routeQuery.category || 'all') as ProfileAssetSearchCategoryId
  keyword.value = routeQuery.keyword || ''
  void refreshList()
})

const handleCategoryChange = (categoryId: ProfileAssetSearchCategoryId) => {
  activeCategory.value = categoryId
  void refreshList()
}

const handleKeywordInput = (event: Event | { detail?: { value?: string } }) => {
  const nextValue = (() => {
    if (event && typeof event === 'object' && 'detail' in event) {
      return event.detail?.value ?? ''
    }

    return ((event as Event).target as HTMLInputElement | null)?.value ?? ''
  })()
  keyword.value = nextValue
  void refreshList()
}

const handleAssetClick = (item: ProfileAssetSearchItem) => {
  uni.navigateTo({
    url: buildProfileAssetDetailUrl(item.id, item.categoryId, item.title),
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
.profile-assets-page {
  width: 100%;
  min-height: 100dvh;
  background:
    radial-gradient(circle at top right, rgba(34, 211, 238, 0.08), transparent 36%),
    linear-gradient(180deg, #fafafa 0%, #f4f5f7 100%);
}

.profile-assets-scroll {
  height: 100dvh;
}

.profile-assets-flow {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100%;
  padding: 16px 16px 32px;
  box-sizing: border-box;
}

.profile-assets-header {
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
}

.profile-assets-back-entry,
.profile-assets-menu-entry,
.profile-assets-header-spacer {
  width: 44px;
  height: 44px;
}

.profile-assets-back-entry,
.profile-assets-menu-entry {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111827;
}

.profile-assets-header-copy {
  min-width: 0;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
}

.profile-assets-header-title {
  color: #111111;
  font-size: 20px;
  line-height: 28px;
  font-weight: 900;
}

.profile-assets-header-subtitle {
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

.profile-assets-search-card,
.profile-assets-empty-card {
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 0 24px rgba(15, 23, 42, 0.05);
}

.profile-assets-search-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

.profile-assets-search-shell {
  min-height: 48px;
  border-radius: 16px;
  background: #f4f5f7;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #64748b;
}

.profile-assets-search-input {
  min-width: 0;
  flex: 1 1 auto;
  color: #111111;
  font-size: 14px;
  line-height: 20px;
  background: transparent;
}

.profile-assets-result-meta {
  color: #94a3b8;
  font-size: 12px;
  line-height: 12px;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.profile-assets-category-wrap {
  position: relative;
}

.profile-assets-category-scroll {
  width: 100%;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.profile-assets-category-scroll::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.profile-assets-category-track {
  display: flex;
  align-items: center;
  gap: 8px;
  width: max-content;
  padding-right: 24px;
  box-sizing: border-box;
}

.profile-assets-category-entry {
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: #f4f5f7;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.profile-assets-category-entry.is-active {
  background: #111111;
}

.profile-assets-category-text {
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
  color: #9ca3af;
}

.profile-assets-category-entry.is-active .profile-assets-category-text {
  color: #ffffff;
}

.profile-assets-category-fade-right {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 24px;
  pointer-events: none;
  background: linear-gradient(270deg, #fafafa 0%, rgba(250, 250, 250, 0) 100%);
}

.profile-assets-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 12px;
}

.profile-assets-entry {
  display: block;
}

.profile-assets-entry-visual {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 18px;
  border: 1px solid #eef2f7;
  background: #ffffff;
  box-shadow: 0 0 18px rgba(15, 23, 42, 0.04);
  overflow: hidden;
}

.profile-assets-entry-type {
  position: absolute;
  top: 12px;
  left: 12px;
  color: #cbd5e1;
  font-size: 12px;
  line-height: 12px;
  transform: scale(0.75);
  transform-origin: left top;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.profile-assets-entry-canvas {
  position: absolute;
  inset: 18px;
  border-radius: 18px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 252, 0.92) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
}

.profile-assets-entry-id {
  position: absolute;
  right: 12px;
  bottom: 12px;
  color: #cbd5e1;
  font-size: 12px;
  line-height: 12px;
  transform: scale(0.75);
  transform-origin: right bottom;
  font-family: var(--aether-font-system, system-ui, sans-serif);
}

.profile-assets-entry-copy {
  padding: 8px 4px 0;
}

.profile-assets-entry-title {
  display: block;
  color: #111111;
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}

.profile-assets-entry-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.profile-assets-entry-category,
.profile-assets-entry-date {
  color: #9ca3af;
  font-size: 12px;
  line-height: 12px;
}

.profile-assets-empty-card {
  min-height: 168px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #cbd5e1;
}

.profile-assets-empty-title {
  color: #9ca3af;
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
}
</style>

