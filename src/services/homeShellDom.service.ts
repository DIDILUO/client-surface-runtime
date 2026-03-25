/**
 * 文件版本：v0001
 * 更新时间：2026-03-23 20:52:20
 * Encoding: UTF-8
 * 本次更新：新增首页壳层滚动锁定服务，统一 document overflow 控制入口
 */

const applyDocumentOverflow = (overflow: string): void => {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.style.overflow = overflow
  document.body.style.overflow = overflow
}

export const syncHomeShellDocumentScrollLock = (isLocked: boolean): void => {
  applyDocumentOverflow(isLocked ? 'hidden' : '')
}

export const clearHomeShellDocumentScrollLock = (): void => {
  applyDocumentOverflow('')
}
