/**
 * 文件版本：v0001
 * 更新时间：2026-03-23 16:37:35
 * Encoding: UTF-8
 * 本次更新：新增页面占位内容 Mock 适配器，实现页面内容端口
 */

import type {
  NoticeContentPreset,
  PageContentPort,
  UpdatingContentPreset,
} from '../ports/pageContent.port'

const defaultUpdatingPreset: UpdatingContentPreset = {
  description: '该入口已预留，后续会接入真实流程、参数校验与结果反馈链路。',
  reserveHint: '当前阶段只提供独立落点，不接入真实业务执行。',
  badges: ['Activity', 'Entry Reserved', 'Pipeline Pending'],
}

const updatingPresetMap: Record<string, UpdatingContentPreset> = {
  'UPD-HOME-BANNER': {
    description: '主视觉入口正在接入正式活动状态流和实时反馈链路。',
    reserveHint: '当前仅开放占位入口，待后端状态流联调后启用。',
    badges: ['Banner', 'Entry Reserved', 'Pipeline Pending'],
  },
  'UPD-HOME-COLLECTION': {
    description: '首发藏品链路正在补齐价格校验与铸造节流逻辑。',
    reserveHint: '请以公告回执为准，勿重复提交同一交易动作。',
    badges: ['Collection', 'Entry Reserved', 'Pipeline Pending'],
  },
  'UPD-PROFILE-SYNC': {
    description: '账户同步链路已预留，后续会接入资产明细校验与异常回执。',
    reserveHint: '当前展示为占位形态，暂不触发真实账户同步。',
    badges: ['Profile', 'Entry Reserved', 'Pipeline Pending'],
  },
}

const defaultNoticePreset: NoticeContentPreset = {
  summary: '本轮更新完成铸造链路校正与公告入口收口，请按下列指引完成资产铸造准备。',
  badges: ['Mint', 'System Update', 'Aether Core'],
  blocks: [
    {
      id: 'P-1',
      kind: 'paragraph',
      text: '铸造入口已开放，建议在网络稳定环境下完成钱包确认。若出现状态延迟，请以系统通知回执为准。',
    },
    {
      id: 'L-1',
      kind: 'list',
      title: '操作步骤',
      items: [
        '确认钱包连接状态与可用余额。',
        '进入铸造页面后核对资产批次与价格。',
        '提交后等待链上回执，不要重复提交。',
      ],
    },
    {
      id: 'P-2',
      kind: 'paragraph',
      text: '如遇异常，请通过设置页“问题反馈”入口提交日志编号，系统会在后续批次统一回执处理。',
    },
  ],
}

const noticePresetMap: Record<string, NoticeContentPreset> = {
  'HOME-N-001': defaultNoticePreset,
  'N-01': {
    summary: '虚空艺术展通行证将分批开放领取，请按活动批次核对资格状态。',
    badges: ['Activity', 'Pass', 'Aether Core'],
    blocks: [
      {
        id: 'P-1',
        kind: 'paragraph',
        text: '本次活动入口已经开放预检，正式领取窗口将在下一轮公告中同步开放。',
      },
      {
        id: 'L-1',
        kind: 'list',
        title: '领取前检查',
        items: ['确认账户已完成实名配置。', '确认钱包地址绑定成功。', '确认活动期间内网络稳定。'],
      },
    ],
  },
}

const cloneUpdatingPreset = (preset: UpdatingContentPreset): UpdatingContentPreset => {
  return {
    ...preset,
    badges: [...preset.badges],
  }
}

const cloneNoticePreset = (preset: NoticeContentPreset): NoticeContentPreset => {
  return {
    summary: preset.summary,
    badges: [...preset.badges],
    blocks: preset.blocks.map((block) => {
      if (block.kind === 'paragraph') {
        return { ...block }
      }

      return {
        ...block,
        items: [...block.items],
      }
    }),
  }
}

export const pageContentMockAdapter: PageContentPort = {
  getDefaultUpdatingPreset() {
    return cloneUpdatingPreset(defaultUpdatingPreset)
  },
  getUpdatingPreset(moduleId) {
    const preset = updatingPresetMap[moduleId]
    return preset ? cloneUpdatingPreset(preset) : undefined
  },
  getDefaultNoticePreset() {
    return cloneNoticePreset(defaultNoticePreset)
  },
  getNoticePreset(noticeId) {
    const preset = noticePresetMap[noticeId]
    return preset ? cloneNoticePreset(preset) : undefined
  },
}
