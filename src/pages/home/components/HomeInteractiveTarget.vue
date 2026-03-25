<!--
文件版本：v0001
更新时间：2026-03-25 21:38:00
Encoding: UTF-8
本次更新：新增首页共享交互基元，统一热区与交互状态
-->

<template>
  <view
    class="home-interactive-target"
    :class="[
      `mode-${props.interactionMode}`,
      {
        'is-disabled': props.disabled,
        'is-pressed': isPressed,
        'is-entry-active': isPressed,
        'is-selected': props.selected,
      },
    ]"
    :style="interactionStyle"
    hover-class="none"
    role="button"
    :tabindex="props.disabled ? -1 : 0"
    :aria-label="props.label || undefined"
    :aria-disabled="props.disabled ? 'true' : 'false'"
    @tap="handleActivate"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousedown="handlePointerDown"
    @mouseup="handlePointerUp"
    @touchstart.passive="handleTouchStart"
    @touchend="handleTouchEnd"
    @touchcancel="handleTouchCancel"
    @keydown.enter="handleKeyDown"
    @keyup.enter="handleKeyActivate"
    @keydown.space.prevent="handleKeyDown"
    @keyup.space.prevent="handleKeyActivate"
    @blur="handleBlur"
  >
    <view class="home-interactive-target-hit" aria-hidden="true" />
    <view class="home-interactive-target-visual">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, type CSSProperties } from 'vue'

interface Props {
  label?: string
  disabled?: boolean
  selected?: boolean
  interactionMode?: 'block' | 'compact'
  hitWidth?: number
  hitHeight?: number
  hitRadius?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  disabled: false,
  selected: false,
  interactionMode: 'block',
  hitWidth: 44,
  hitHeight: 44,
  hitRadius: '999px',
})

const emit = defineEmits<{
  activate: []
  mouseenter: []
  mouseleave: []
  touchstart: []
  touchend: []
  touchcancel: []
}>()

const isPressed = ref(false)

const interactionStyle = computed<CSSProperties>(() => {
  return {
    '--home-interactive-hit-width': `${Math.max(props.hitWidth, 44)}px`,
    '--home-interactive-hit-height': `${Math.max(props.hitHeight, 44)}px`,
    '--home-interactive-hit-radius': props.hitRadius,
  } as CSSProperties
})

const clearPressed = () => {
  isPressed.value = false
}

const setPressed = () => {
  if (props.disabled) {
    return
  }
  isPressed.value = true
}

const handleActivate = () => {
  if (props.disabled) {
    clearPressed()
    return
  }
  emit('activate')
  clearPressed()
}

const handleMouseEnter = () => {
  emit('mouseenter')
}

const handleMouseLeave = () => {
  emit('mouseleave')
  clearPressed()
}

const handlePointerDown = () => {
  setPressed()
}

const handlePointerUp = () => {
  clearPressed()
}

const handleTouchStart = () => {
  setPressed()
  emit('touchstart')
}

const handleTouchEnd = () => {
  clearPressed()
  emit('touchend')
}

const handleTouchCancel = () => {
  clearPressed()
  emit('touchcancel')
}

const handleKeyDown = () => {
  setPressed()
}

const handleKeyActivate = () => {
  handleActivate()
}

const handleBlur = () => {
  clearPressed()
}
</script>

<style lang="scss" scoped>
.home-interactive-target {
  position: relative;
  display: block;
  min-width: 0;
  outline: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.home-interactive-target.is-disabled {
  cursor: default;
  pointer-events: none;
}

.home-interactive-target-hit {
  position: absolute;
  z-index: 0;
  pointer-events: none;
  transition:
    box-shadow 180ms ease,
    background-color 180ms ease,
    opacity 180ms ease;
}

.home-interactive-target.mode-block .home-interactive-target-hit {
  inset: 0;
  border-radius: inherit;
}

.home-interactive-target.mode-compact .home-interactive-target-hit {
  left: 50%;
  top: 50%;
  width: var(--home-interactive-hit-width, 44px);
  height: var(--home-interactive-hit-height, 44px);
  border-radius: var(--home-interactive-hit-radius, 999px);
  transform: translate(-50%, -50%);
}

.home-interactive-target-visual {
  position: relative;
  z-index: 1;
  min-width: 0;
  display: inherit;
  align-items: inherit;
  justify-content: inherit;
  flex-direction: inherit;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.home-interactive-target.is-pressed .home-interactive-target-hit {
  background: rgba(15, 23, 42, 0.04);
}

.home-interactive-target:focus-visible .home-interactive-target-hit {
  box-shadow:
    0 0 0 4px rgba(34, 211, 238, 0.38),
    0 0 0 8px rgba(34, 211, 238, 0.16);
}

.home-interactive-target.is-disabled .home-interactive-target-hit {
  opacity: 0.48;
  box-shadow: none;
  background: transparent;
}
</style>
