import type {
  ContentActionRequestDto,
  ContentActionResultDto,
  ContentEnvelope,
  ContentListDto,
  ContentListRequestDto,
  ContentResourceDto,
  ContentResourceRequestDto,
  ContentSceneDto,
  ContentSceneRequestDto,
} from '../contracts/content-api.contract'

export interface ContentPort {
  getScene: (input: ContentSceneRequestDto) => Promise<ContentEnvelope<ContentSceneDto | null>>
  getResource: (input: ContentResourceRequestDto) => Promise<ContentEnvelope<ContentResourceDto | null>>
  getList: (input: ContentListRequestDto) => Promise<ContentEnvelope<ContentListDto>>
  runAction: (input: ContentActionRequestDto) => Promise<ContentEnvelope<ContentActionResultDto>>
}
