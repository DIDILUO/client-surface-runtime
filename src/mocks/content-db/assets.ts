import type { ContentAssetDto } from '../../contracts/content-api.contract'

const bannerBase = '/static/home/banner'

export const contentAssetDb: Record<string, ContentAssetDto> = {
  'ASSET-BANNER-AX99': {
    assetId: 'ASSET-BANNER-AX99',
    originalUrl: `${bannerBase}/ax99-banner.jpg`,
    width: 686,
    height: 336,
    focalPoint: { x: 0.5, y: 0.5 },
    variants: {
      banner: `${bannerBase}/ax99-banner.jpg`,
      detail: `${bannerBase}/ax99-banner.jpg`,
    },
  },
  'ASSET-BANNER-BX17': {
    assetId: 'ASSET-BANNER-BX17',
    originalUrl: `${bannerBase}/bx17-banner.jpg`,
    width: 686,
    height: 336,
    focalPoint: { x: 0.5, y: 0.5 },
    variants: {
      banner: `${bannerBase}/bx17-banner.jpg`,
      detail: `${bannerBase}/bx17-banner.jpg`,
    },
  },
  'ASSET-BANNER-CX42': {
    assetId: 'ASSET-BANNER-CX42',
    originalUrl: `${bannerBase}/cx42-banner.jpg`,
    width: 686,
    height: 336,
    focalPoint: { x: 0.5, y: 0.5 },
    variants: {
      banner: `${bannerBase}/cx42-banner.jpg`,
      detail: `${bannerBase}/cx42-banner.jpg`,
    },
  },
}

export const cloneContentAsset = (assetId?: string | null): ContentAssetDto | null => {
  if (!assetId) {
    return null
  }

  const asset = contentAssetDb[assetId]
  if (!asset) {
    return null
  }

  return {
    ...asset,
    focalPoint: asset.focalPoint ? { ...asset.focalPoint } : undefined,
    variants: asset.variants ? { ...asset.variants } : undefined,
  }
}
