/**
 * 文件版本：v0002
 * 更新时间：2026-03-23 07:36:11
 * Encoding: UTF-8
 * 本次更新：补充文件头编码格式标记并同步基础文件更新记录
 * 文件职责：
 * 1. 承载应用初始化入口。
 * 2. 负责挂载首批已拍板的基础依赖：`Pinia`。
 * 3. 更复杂的宿主桥、运行时服务和全局插件，后续仍需按批次接入。
 */

import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './uni.scss'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()

  app.use(pinia)

  return {
    app,
    pinia,
  }
}
