/**
 * 文件版本：v0001
 * 更新时间：2026-03-25 23:06:00
 * Encoding: UTF-8
 * 本次更新：收口首页抽屉与窄侧栏图标映射
 */

import {
  History,
  House,
  Settings,
  ShieldCheck,
  Sparkles,
  UserPlus,
  UserRound,
  Users,
  Wallet,
} from 'lucide-vue-next'
import type { HomeShellIconKey } from '../models/homeShellMenu.model'

const HOME_SHELL_ICON_MAP = {
  history: History,
  'shield-check': ShieldCheck,
  wallet: Wallet,
  'user-plus': UserPlus,
  users: Users,
  settings: Settings,
  house: House,
  sparkles: Sparkles,
  'user-round': UserRound,
} as const

export const resolveHomeShellIconComponent = (iconKey: HomeShellIconKey) => {
  return HOME_SHELL_ICON_MAP[iconKey]
}
