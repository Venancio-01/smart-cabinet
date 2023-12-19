import { faceEngineSDKPath } from '@smart-cabinet/utils/config/main'
import { Library } from 'ffi-napi'
import ref from 'ref-napi'
import ArrayType from 'ref-array-di'
import StructType from 'ref-struct-di'

export const CArray = ArrayType(ref)
export const CStruct = StructType(ref)

let handle: any = null

const ASF_VERSION = CStruct({
  Version: ref.types.CString,
  BuildDate: ref.types.CString,
  CopyRight: ref.types.CString,
})

export function initFace() {
  handle = Library(faceEngineSDKPath, {
    ASFGetVersion: [ASF_VERSION, []],
    // ASFGetActiveFileInfo:
    // ASFOnlineActivation: ['int', ['uchar', 'uchar', 'uchar']],
  })

  const result = handle.ASFGetVersion()

  console.log('🚀 ~ file: index.ts:26 ~ initFace ~ result:', result.Version)
  console.log('🚀 ~ file: index.ts:26 ~ initFace ~ result:', result.BuildDate)
  console.log('🚀 ~ file: index.ts:26 ~ initFace ~ result:', result.CopyRight)
}

// 在线激活 sdk
export function onlineActivation() {
  const APPID = 'BQZiN32nNRvvEDTgBPCVXJgsmVS8bLPgkhXBst2wMr81'
  const SDK_KEY = '6eTKVpmoBFFQ7J6Ni87UN914rwhxJv7BzeViWGrV8dQu'
  const ACTIVE_KEY = '82H1-11MP-611H-XLW4'
  const result = handle.ASFOnlineActivation(APPID, SDK_KEY, ACTIVE_KEY)
  console.log('🚀 ~ file: index.ts:22 ~ onlineActivation ~ result:', result)
}

export function getActiveFileInfo() {

}
