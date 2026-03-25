/**
 * 文件版本：v0013
 * 更新时间：2026-03-24 17:19:00
 * Encoding: UTF-8
 * 本次更新：布局模式判定接入运行时能力上下文，支持触控端多页并行门禁
 */

import { onMounted, onUnmounted, ref } from 'vue'
import { HOME_LAYOUT_MODE_SINGLE_PAGE, type LayoutMode } from '../models/homeShell.model'
import {
  bindHomeShellViewportListeners,
  type ViewportRuntimeContext,
  resolveHomeShellLayoutMode,
  resolveHomeShellViewportSnapshot,
} from '../services/homeShellLayoutMode.service'

const hasRuntimeContextChanged = (current: ViewportRuntimeContext, next: ViewportRuntimeContext): boolean => {
  if (current.viewportWidth !== next.viewportWidth) {
    return true
  }

  if (current.viewportHeight !== next.viewportHeight) {
    return true
  }

  if (current.safeAreaTop !== next.safeAreaTop) {
    return true
  }

  if (current.safeAreaBottom !== next.safeAreaBottom) {
    return true
  }

  if (current.hasVisualViewport !== next.hasVisualViewport) {
    return true
  }

  if (current.hasWindowSegments !== next.hasWindowSegments) {
    return true
  }

  if (current.segmentCount !== next.segmentCount) {
    return true
  }

  if (current.pointerType !== next.pointerType) {
    return true
  }

  if (current.hoverCapable !== next.hoverCapable) {
    return true
  }

  return false
}

export const useResponsiveRailLayout = () => {
  const layoutMode = ref<LayoutMode>(HOME_LAYOUT_MODE_SINGLE_PAGE)
  const runtimeContext = ref<ViewportRuntimeContext>({
    viewportWidth: 0,
    viewportHeight: 0,
    safeAreaTop: 0,
    safeAreaBottom: 0,
    hasVisualViewport: false,
    hasWindowSegments: false,
    segmentCount: 0,
    pointerType: 'unknown',
    hoverCapable: false,
  })
  let disposeViewportListeners: (() => void) | null = null

  const syncViewport = () => {
    if (typeof window === 'undefined') {
      return
    }

    const viewportSnapshot = resolveHomeShellViewportSnapshot(window)
    if (hasRuntimeContextChanged(runtimeContext.value, viewportSnapshot.runtimeContext)) {
      runtimeContext.value = viewportSnapshot.runtimeContext
    }

    const nextLayoutMode = resolveHomeShellLayoutMode(
      viewportSnapshot.runtimeContext,
      viewportSnapshot.runtimeContext.viewportWidth,
      viewportSnapshot.segmentPreference,
      layoutMode.value,
    )

    if (layoutMode.value !== nextLayoutMode) {
      layoutMode.value = nextLayoutMode
    }
  }

  onMounted(() => {
    syncViewport()
    if (typeof window !== 'undefined') {
      disposeViewportListeners = bindHomeShellViewportListeners(window, syncViewport, {
        minIntervalMs: 80,
      })
    }
  })

  onUnmounted(() => {
    disposeViewportListeners?.()
    disposeViewportListeners = null
  })

  return {
    layoutMode,
    runtimeContext,
  }
}
