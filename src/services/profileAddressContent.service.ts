import type { ProfileAddressContent } from '../models/profileAddress.model'
import { createHomeRailProfileContentShell, resolveHomeRailProfileContent } from './homeRailProfileContent.service'

const profileAddressShell: ProfileAddressContent = {
  displayName: '',
  address: '',
  networkLabel: 'AETHER ADDRESS',
  statusLabel: 'BOUND',
  summary: '当前地址用于承接账号资产、铸造结果与后续服务动作的统一归属。',
}

export const createProfileAddressContentShell = (): ProfileAddressContent => {
  const shell = createHomeRailProfileContentShell()

  return {
    ...profileAddressShell,
    displayName: shell.summary.displayName,
    address: shell.summary.address,
  }
}

export const resolveProfileAddressContent = async (): Promise<ProfileAddressContent> => {
  const content = await resolveHomeRailProfileContent()

  return {
    ...profileAddressShell,
    displayName: content.summary.displayName,
    address: content.summary.address,
  }
}
