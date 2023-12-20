import { faceEngineSDKPath } from '@smart-cabinet/utils/config/main'
import { Library } from 'ffi-napi'
import messageMapping from './message'
import { HandleType } from './types'

let faceSDK: any = null
const engineHandle: any = null

export function initFace() {
  faceSDK = Library(faceEngineSDKPath, {
    ASFOnlineActivation: ['int', ['string', 'string', 'string']],
    ASFInitEngine: ['int', ['int', 'int', 'int', 'int', 'int', HandleType]],
  })
}

// 在线激活 sdk
export function onlineActivation() {
  const APPID = 'BQZiN32nNRvvEDTgBPCVXJgsmVS8bLPgkhXBst2wMr81'
  const SDK_KEY = '6eTKVpmoBFFQ7J6Ni87UN914rwhxJv7BzeViWGrV8dQu'
  const ACTIVE_KEY = '82H1-11MP-612Y-32HT'
  const result = faceSDK.ASFOnlineActivation(APPID, SDK_KEY, ACTIVE_KEY)

  if (result !== 0) {
    console.log(messageMapping[result])
  }

  console.log('🚀 ~ file: index.ts:22 ~ onlineActivation ~ result:', result)
}

// 初始化引擎
export function initFaceEngine() {
  const DETECT_MODE = 0xFFFFFFFF
  const ORIENT_PRIORITY = 0x1
  const DETECT_FACE_SCALE_VAL = 32
  const DETECT_FACE_MAX_NUM = 5
  const COMBINED_MASK = 0x00000001

  const result = faceSDK.ASFInitEngine(DETECT_MODE, ORIENT_PRIORITY, DETECT_FACE_SCALE_VAL, DETECT_FACE_MAX_NUM, COMBINED_MASK, engineHandle)
  console.log('🚀 ~ file: index.ts:39 ~ initEngine ~ result:', result)
}
