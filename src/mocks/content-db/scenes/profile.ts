import type { ContentProfileCategoryId } from '../../../contracts/content-api.contract'

export interface ProfileSceneAssetRecord {
  itemId: string
  title: string
  acquiredAt: string
  subCategory: string
  categoryId: ContentProfileCategoryId
}

export interface ProfileSceneDb {
  sceneId: 'profile'
  version: number
  updatedAt: string
  summary: {
    displayName: string
    address: string
    currency: string
    totalValueInCent: number
    holdingsCount: number
  }
  assets: {
    categories: Array<{
      categoryId: ContentProfileCategoryId
      categoryName: string
    }>
    subCategories: string[]
    items: ProfileSceneAssetRecord[]
  }
}

export const profileSceneDb: ProfileSceneDb = {
  sceneId: 'profile',
  version: 1,
  updatedAt: '2026-03-25T16:36:00+08:00',
  summary: {
    displayName: 'Kael_0x',
    address: '0x8A...3F92',
    currency: 'CNY',
    totalValueInCent: 1245000,
    holdingsCount: 14,
  },
  assets: {
    categories: [
      { categoryId: 'collections', categoryName: '资产藏品' },
      { categoryId: 'blindBoxes', categoryName: '盲盒' },
      { categoryId: 'certificates', categoryName: '资格证' },
    ],
    subCategories: ['全部', '数字艺术', '3D组件', '音乐现场'],
    items: [
      { itemId: 'M-01', title: '零号序列', acquiredAt: '2024.10.12', subCategory: '数字艺术', categoryId: 'collections' },
      { itemId: 'M-02', title: '以太之种', acquiredAt: '2024.10.15', subCategory: '3D组件', categoryId: 'collections' },
      { itemId: 'M-03', title: '脉冲核心', acquiredAt: '2024.10.18', subCategory: '音乐现场', categoryId: 'collections' },
      { itemId: 'M-04', title: '玄光信标', acquiredAt: '2024.10.19', subCategory: '数字艺术', categoryId: 'collections' },
      { itemId: 'B-01', title: '创世盲盒 #01', acquiredAt: '2024.10.05', subCategory: '数字艺术', categoryId: 'blindBoxes' },
      { itemId: 'B-02', title: '节点盲盒 #02', acquiredAt: '2024.10.09', subCategory: '3D组件', categoryId: 'blindBoxes' },
      { itemId: 'Z-01', title: '优先购资格证', acquiredAt: '2024.10.20', subCategory: '音乐现场', categoryId: 'certificates' },
      { itemId: 'Z-02', title: '活动白名单凭证', acquiredAt: '2024.10.21', subCategory: '数字艺术', categoryId: 'certificates' },
    ],
  },
}
