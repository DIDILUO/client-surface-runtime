import type { ContentNoticeBlockDto } from '../../contracts/content-api.contract'

export interface ContentNoticeRecord {
  noticeId: string
  title: string
  englishTitle: string
  type: string
  time: string
  status: 'online'
  updatedAt: string
  summary: string
  badges: string[]
  blocks: ContentNoticeBlockDto[]
}

const cloneNoticeBlocks = (blocks: ContentNoticeBlockDto[]): ContentNoticeBlockDto[] => {
  return blocks.map((block) => {
    if (block.kind === 'paragraph') {
      return { ...block }
    }

    return {
      ...block,
      items: [...block.items],
    }
  })
}

const createNoticeRecord = (input: Omit<ContentNoticeRecord, 'blocks'> & { blocks: ContentNoticeBlockDto[] }): ContentNoticeRecord => ({
  ...input,
  badges: [...input.badges],
  blocks: cloneNoticeBlocks(input.blocks),
})

export const contentNoticeDb: ContentNoticeRecord[] = [
  createNoticeRecord({
    noticeId: 'HOME-N-001',
    title: '第 0 批次核心资产「合成黎明」铸造通道正式开启',
    englishTitle: 'Notice Detail',
    type: '系统公告',
    time: '10-23',
    status: 'online',
    updatedAt: '2026-03-23T10:23:00+08:00',
    summary: '首页公告条当前重点提示，用于首屏已读与公告详情页共源。',
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
        items: ['确认钱包连接状态与可用余额。', '进入铸造页面后核对资产批次与价格。', '提交后等待链上回执，不要重复提交。'],
      },
      {
        id: 'P-2',
        kind: 'paragraph',
        text: '如遇异常，请通过设置页“问题反馈”入口提交日志编号，系统会在后续批次统一回执处理。',
      },
    ],
  }),
  createNoticeRecord({
    noticeId: 'HOME-N-002',
    title: '平台手续费模型已更新，市场挂单将按新规则结算',
    englishTitle: 'Notice Detail',
    type: '系统公告',
    time: '10-22',
    status: 'online',
    updatedAt: '2026-03-22T10:22:00+08:00',
    summary: '市场规则更新说明，后续会与公告详情页正文对齐。',
    badges: ['Market', 'Settlement', 'Rule Update'],
    blocks: [
      {
        id: 'P-1',
        kind: 'paragraph',
        text: '平台手续费模型已完成本轮更新，后续市场挂单与成交回执会按新结算规则统一处理。',
      },
      {
        id: 'L-1',
        kind: 'list',
        title: '本轮调整内容',
        items: ['挂单手续费与撤单手续费已拆分。', '成交回执展示将补充结算明细。', '部分旧挂单会在下一批完成迁移。'],
      },
    ],
  }),
  createNoticeRecord({
    noticeId: 'HOME-N-003',
    title: '本周维护窗口已发布，请及时确认资产与订单状态',
    englishTitle: 'Notice Detail',
    type: '系统公告',
    time: '10-21',
    status: 'online',
    updatedAt: '2026-03-21T10:21:00+08:00',
    summary: '维护期系统公告，当前用于首页滚动通知与详情占位。',
    badges: ['Maintenance', 'System Window', 'Status Check'],
    blocks: [
      {
        id: 'P-1',
        kind: 'paragraph',
        text: '本周维护窗口已发布。维护期间部分资产状态与订单状态可能延迟刷新，请以系统最终回执为准。',
      },
      {
        id: 'L-1',
        kind: 'list',
        title: '维护期建议',
        items: ['避免在维护窗口内重复提交交易动作。', '优先核对待支付与待确认订单。', '如状态异常请记录订单编号后再提交反馈。'],
      },
    ],
  }),
  createNoticeRecord({
    noticeId: 'N-01',
    title: '「虚空」艺术展全球通行证分发公告',
    englishTitle: 'Notice Detail',
    type: '活动预告',
    time: '10-24',
    status: 'online',
    updatedAt: '2026-03-24T10:24:00+08:00',
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
  }),
  createNoticeRecord({
    noticeId: 'N-02',
    title: '第 0 批次核心资产 [合成黎明] 铸造指引',
    englishTitle: 'Notice Detail',
    type: '系统更新',
    time: '10-23',
    status: 'online',
    updatedAt: '2026-03-23T09:40:00+08:00',
    summary: '首发藏品铸造前请先完成账户与网络核验，避免重复提交。',
    badges: ['Mint', 'Guide', 'Aether Core'],
    blocks: [
      {
        id: 'P-1',
        kind: 'paragraph',
        text: '本批次铸造采用统一排队链路，提交后请等待链上确认，不要在短时间内重复发起。',
      },
      {
        id: 'L-1',
        kind: 'list',
        title: '提交前检查',
        items: ['确认钱包网络已切换到正确链。', '确认账户余额足以支付手续费。', '确认资产批次与铸造价格一致。'],
      },
    ],
  }),
  createNoticeRecord({
    noticeId: 'N-03',
    title: 'AETHER 社区节点维护升级说明',
    englishTitle: 'Notice Detail',
    type: '维护通知',
    time: '10-20',
    status: 'online',
    updatedAt: '2026-03-20T11:10:00+08:00',
    summary: '社区节点将在维护窗口内完成升级，期间部分社区入口将进入只读状态。',
    badges: ['Community', 'Maintenance', 'Upgrade'],
    blocks: [
      {
        id: 'P-1',
        kind: 'paragraph',
        text: '维护期间社区互动入口将临时只读，历史内容不会丢失，恢复时间以后续公告为准。',
      },
    ],
  }),
  createNoticeRecord({
    noticeId: 'N-04',
    title: '账户异常行为防护策略更新',
    englishTitle: 'Notice Detail',
    type: '安全警报',
    time: '10-19',
    status: 'online',
    updatedAt: '2026-03-19T17:30:00+08:00',
    summary: '账户风险识别模型已升级，部分异常登录与高频交易行为将触发二次校验。',
    badges: ['Security', 'Risk Control', 'Account'],
    blocks: [
      {
        id: 'P-1',
        kind: 'paragraph',
        text: '本轮风控策略会针对异常登录与高频交易行为触发额外校验，请确保账户联系方式可用。',
      },
      {
        id: 'L-1',
        kind: 'list',
        title: '建议处理方式',
        items: ['开启二次验证。', '确认常用设备登录记录。', '出现冻结提示时先核对系统邮件与站内通知。'],
      },
    ],
  }),
  createNoticeRecord({
    noticeId: 'N-05',
    title: 'Creator Guild 第四期社区共创开放',
    englishTitle: 'Notice Detail',
    type: '社区动态',
    time: '10-18',
    status: 'online',
    updatedAt: '2026-03-18T14:20:00+08:00',
    summary: '第四期社区共创计划开放报名，后续会按主题分批公布入选名单。',
    badges: ['Creator', 'Community', 'Open Call'],
    blocks: [
      {
        id: 'P-1',
        kind: 'paragraph',
        text: '本期共创聚焦品牌视觉、互动叙事与资产衍生三类方向，报名后请留意站内通知。',
      },
    ],
  }),
]

export const contentNoticeUnreadSeed: Record<string, boolean> = {
  'HOME-N-001': true,
  'HOME-N-002': false,
  'HOME-N-003': false,
}
