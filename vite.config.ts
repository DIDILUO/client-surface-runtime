/**
 * 文件版本：v0002
 * 更新时间：2026-03-23 07:36:11
 * Encoding: UTF-8
 * 本次更新：补充文件头编码格式标记并同步基础文件更新记录
 */

import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

/**
 * 文件职责：
 * 1. 承载 uni-app + Vite 的最小构建入口。
 * 2. 当前阶段只保持官方主路径所需的最小配置，不提前引入自定义构建分支。
 * 3. 后续如需环境变量、别名增强或多端特殊配置，必须先经过单独审查。
 */
export default defineConfig({
  plugins: [uni()],
})
