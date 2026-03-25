/**
 * 文件版本：v0015
 * 更新时间：2026-03-23 22:52:50
 * Encoding: UTF-8
 * 本次更新：壳层派生状态改为单一聚合出口，减少分散 service 调用
 */

import { computed, onUnmounted, ref, watch, type Ref } from 'vue'
import {
  HOME_DEFAULT_SECONDARY_PAGE_KEY,
  HOME_PRIMARY_PAGE_KEY,
  type LayoutMode,
  type PageKey,
  type SecondaryPageKey,
} from '../models/homeShell.model'
import {
  clearHomeShellDocumentScrollLock,
  syncHomeShellDocumentScrollLock,
} from '../services/homeShellDom.service'
import {
  resolveHomeShellDerivedState,
  resolveHomeShellStateOnTabChange,
  resolveHomeShellStateOnLayoutChange,
} from '../services/homeShellState.service'

interface UseHomeShellStateInput {
  layoutMode: Ref<LayoutMode>
}

export const useHomeShellState = (input: UseHomeShellStateInput) => {
  const singleModeTab = ref<PageKey>(HOME_PRIMARY_PAGE_KEY)
  const doubleSecondaryTab = ref<SecondaryPageKey>(HOME_DEFAULT_SECONDARY_PAGE_KEY)
  const isDrawerOpen = ref(false)
  const homeShellDerivedState = computed(() => {
    return resolveHomeShellDerivedState(input.layoutMode.value, singleModeTab.value, doubleSecondaryTab.value)
  })

  const isDrawerLayerOpen = computed(() => {
    return homeShellDerivedState.value.canUseDrawer && isDrawerOpen.value
  })

  const handleDrawerOpen = () => {
    if (!homeShellDerivedState.value.canUseDrawer) {
      return
    }

    isDrawerOpen.value = true
  }

  const handleDrawerClose = () => {
    isDrawerOpen.value = false
  }

  const handleTabChange = (tab: PageKey) => {
    const tabTransition = resolveHomeShellStateOnTabChange({
      layoutMode: input.layoutMode.value,
      currentSingleModeTab: singleModeTab.value,
      currentDoubleSecondaryTab: doubleSecondaryTab.value,
      nextTab: tab,
    })

    if (singleModeTab.value !== tabTransition.nextSingleModeTab) {
      singleModeTab.value = tabTransition.nextSingleModeTab
    }

    if (doubleSecondaryTab.value !== tabTransition.nextDoubleSecondaryTab) {
      doubleSecondaryTab.value = tabTransition.nextDoubleSecondaryTab
    }
  }

  watch(input.layoutMode, (nextMode, previousMode) => {
    const layoutTransition = resolveHomeShellStateOnLayoutChange({
      previousLayoutMode: previousMode,
      nextLayoutMode: nextMode,
      singleModeTab: singleModeTab.value,
      doubleSecondaryTab: doubleSecondaryTab.value,
    })

    if (layoutTransition.shouldCloseDrawer) {
      isDrawerOpen.value = false
    }

    if (doubleSecondaryTab.value !== layoutTransition.nextDoubleSecondaryTab) {
      doubleSecondaryTab.value = layoutTransition.nextDoubleSecondaryTab
    }

    if (singleModeTab.value !== layoutTransition.nextSingleModeTab) {
      singleModeTab.value = layoutTransition.nextSingleModeTab
    }
  })

  watch(isDrawerLayerOpen, () => {
    syncHomeShellDocumentScrollLock(isDrawerLayerOpen.value)
  }, { immediate: true })

  onUnmounted(() => {
    clearHomeShellDocumentScrollLock()
  })

  return {
    isDrawerLayerOpen,
    homeShellDerivedState,
    handleDrawerOpen,
    handleDrawerClose,
    handleTabChange,
  }
}
