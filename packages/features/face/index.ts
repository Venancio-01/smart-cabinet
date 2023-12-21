import { faceEngineSDKPath } from '@smart-cabinet/utils/config/main'
import { Library } from 'ffi-napi'
import ref from 'ref-napi'
import messageMapping from './message'

let faceSDK: any = null
const engineHandle = ref.NULL_POINTER
const detectedFaces = ref.NULL_POINTER

export function initFaceSDK() {
  faceSDK = Library(faceEngineSDKPath, {
    ASFOnlineActivation: ['int', ['string', 'string', 'string']],
    ASFInitEngine: ['int', ['uint', 'uint', 'int', 'int', 'uint', 'pointer']],
    ASFDetectFacesEx: ['int', ['pointer', 'pointer', 'pointer']],
    // ASFFaceFeatureCompare: ['int'],
  })
}

// 在线激活 sdk
export function onlineActivation() {
  const APPID = 'BQZiN32nNRvvEDTgBPCVXJgsmVS8bLPgkhXBst2wMr81'
  const SDK_KEY = '6eTKVpmoBFFQ7J6Ni87UN914rwhxJv7BzeViWGrV8dQu'
  const ACTIVE_KEY = '82H1-11MP-6135-6Z2K'
  const result = faceSDK.ASFOnlineActivation(APPID, SDK_KEY, ACTIVE_KEY)

  console.log(messageMapping[result])
}

// 初始化引擎
export function initFaceEngine() {
  const DETECT_MODE = 0x00000000
  const ORIENT_PRIORITY = 0x5
  const DETECT_FACE_SCALE_VAL = 16
  const DETECT_FACE_MAX_NUM = 1
  const COMBINED_MASK = 0x00000001 | 0x00000004 | 0x00000020

  const result = faceSDK.ASFInitEngine(DETECT_MODE, ORIENT_PRIORITY, DETECT_FACE_SCALE_VAL, DETECT_FACE_MAX_NUM, COMBINED_MASK, engineHandle)
  console.log(messageMapping[result])
}
