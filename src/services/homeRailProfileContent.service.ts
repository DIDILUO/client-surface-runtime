import type {
  ContentProfileAssetsBlockDto,
  ContentProfileCategoryId,
  ContentProfileSummaryBlockDto,
  ContentSceneDto,
} from '../contracts/content-api.contract'
import { createContentSceneSnapshot } from '../implementations/content.mock'
import type {
  HomeRailProfileContent,
  ProfileAssetItem,
  ProfileCategory,
  ProfileCategoryKey,
  ProfileSummary,
} from '../models/homeRailProfile.model'
import { resolveContentScene } from './content.service'

const profileShell: HomeRailProfileContent = {
  summary: {
    displayName: '',
    totalValue: '0',
    holdings: '0',
    address: '',
  },
  categories: [],
  subCategories: ['全部'],
  assets: {
    collections: [],
    blindBoxes: [],
    certificates: [],
  },
}

const cloneProfileShell = (): HomeRailProfileContent => ({
  summary: { ...profileShell.summary },
  categories: profileShell.categories.map((item) => ({ ...item })),
  subCategories: [...profileShell.subCategories],
  assets: {
    collections: profileShell.assets.collections.map((item) => ({ ...item })),
    blindBoxes: profileShell.assets.blindBoxes.map((item) => ({ ...item })),
    certificates: profileShell.assets.certificates.map((item) => ({ ...item })),
  },
})

const formatCurrencyValue = (priceInCent: number): string => {
  return Math.round(priceInCent / 100).toLocaleString('en-US')
}

const mapProfileSummary = (block?: ContentProfileSummaryBlockDto): ProfileSummary => {
  if (!block) {
    return { ...profileShell.summary }
  }

  return {
    displayName: block.displayName,
    totalValue: formatCurrencyValue(block.totalValueInCent),
    holdings: String(block.holdingsCount),
    address: block.address,
  }
}

const mapProfileCategories = (block?: ContentProfileAssetsBlockDto): ProfileCategory[] => {
  if (!block) {
    return []
  }

  return block.categories.map<ProfileCategory>((item) => ({
    id: item.categoryId as ProfileCategoryKey,
    label: item.categoryName,
  }))
}

const mapProfileAssetsByCategory = (block?: ContentProfileAssetsBlockDto): Record<ProfileCategoryKey, ProfileAssetItem[]> => {
  const assetMap: Record<ProfileCategoryKey, ProfileAssetItem[]> = {
    collections: [],
    blindBoxes: [],
    certificates: [],
  }

  if (!block) {
    return assetMap
  }

  block.items.forEach((item) => {
    const categoryId = item.categoryId as ContentProfileCategoryId
    assetMap[categoryId].push({
      id: item.itemId,
      name: item.title,
      date: item.acquiredAt,
      subCategory: item.subCategory,
    })
  })

  return assetMap
}

const adaptProfileSceneToContent = (scene: ContentSceneDto): HomeRailProfileContent => {
  const summaryBlock = scene.blocks.find((item) => item.blockType === 'profile_summary') as ContentProfileSummaryBlockDto | undefined
  const assetsBlock = scene.blocks.find((item) => item.blockType === 'profile_assets') as ContentProfileAssetsBlockDto | undefined

  return {
    summary: mapProfileSummary(summaryBlock),
    categories: mapProfileCategories(assetsBlock),
    subCategories: assetsBlock ? [...assetsBlock.subCategories] : [...profileShell.subCategories],
    assets: mapProfileAssetsByCategory(assetsBlock),
  }
}

export const createHomeRailProfileContentShell = (): HomeRailProfileContent => {
  const scene = createContentSceneSnapshot('profile')
  return scene ? adaptProfileSceneToContent(scene) : cloneProfileShell()
}

export const resolveHomeRailProfileContent = async (): Promise<HomeRailProfileContent> => {
  const scene = await resolveContentScene({ sceneId: 'profile' })
  return adaptProfileSceneToContent(scene)
}
