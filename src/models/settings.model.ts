/**
 * 文件版本：v0001
 * 更新时间：2026-03-23 16:20:10
 * Encoding: UTF-8
 * 本次更新：新增设置页数据模型定义，统一 summary/sections 类型
 */

import type { ContentTargetDto } from '../contracts/content-api.contract'

export interface SettingItem {
  id: string
  title: string
  value: string
  target?: ContentTargetDto
}

export interface SettingSection {
  id: string
  title: string
  englishTitle: string
  items: SettingItem[]
}

export interface SettingsSummary {
  title: string
  englishTitle: string
  description: string
  actionLabel: string
  actionEnglishLabel: string
  actionTarget?: ContentTargetDto
}

export interface SettingsContent {
  summary: SettingsSummary
  sections: SettingSection[]
}
