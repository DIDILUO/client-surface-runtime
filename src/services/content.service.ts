import type {
  ContentActionRequestDto,
  ContentActionResultDto,
  ContentListDto,
  ContentListRequestDto,
  ContentResourceDto,
  ContentResourceRequestDto,
  ContentSceneDto,
  ContentSceneRequestDto,
} from '../contracts/content-api.contract'
import { contentMockImplementation } from '../implementations/content.mock'
import type { ContentPort } from '../ports/content.port'

const contentPort: ContentPort = contentMockImplementation

const ensureSuccess = <T>(code: number, message: string, data: T | null, label: string): T => {
  if (code !== 0 || data == null) {
    throw new Error(`${label} failed: ${message}`)
  }

  return data
}

export const resolveContentScene = async (input: ContentSceneRequestDto): Promise<ContentSceneDto> => {
  const response = await contentPort.getScene(input)
  return ensureSuccess(response.code, response.message, response.data, 'content scene')
}

export const resolveContentResource = async (input: ContentResourceRequestDto): Promise<ContentResourceDto> => {
  const response = await contentPort.getResource(input)
  return ensureSuccess(response.code, response.message, response.data, 'content resource')
}

export const resolveContentList = async (input: ContentListRequestDto): Promise<ContentListDto> => {
  const response = await contentPort.getList(input)
  return ensureSuccess(response.code, response.message, response.data, 'content list')
}

export const runContentAction = async (input: ContentActionRequestDto): Promise<ContentActionResultDto> => {
  const response = await contentPort.runAction(input)
  return ensureSuccess(response.code, response.message, response.data, 'content action')
}
