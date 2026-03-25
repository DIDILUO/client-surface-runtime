/**
 * 文件版本：v0002
 * 更新时间：2026-03-23 07:36:11
 * Encoding: UTF-8
 * 本次更新：补充文件头编码格式标记并同步基础文件更新记录
 */

import { defineStore } from 'pinia'

/**
 * 文件职责：
 * 1. 作为首个正式 Pinia store 的最小占位实现。
 * 2. 仅承载应用级基础状态，不承载页面私有状态。
 * 3. 后续真实全局状态必须继续沿 `stores/` 边界扩展，不回流到页面中。
 */
export const useAppStore = defineStore('app', {
  state: () => ({
    bootstrapped: false,
  }),
  actions: {
    markBootstrapped() {
      this.bootstrapped = true
    },
  },
})
