import ref from 'ref-napi'
import ArrayType from 'ref-array-di'
import StructType from 'ref-struct-di'

export const Array = ArrayType(ref)
export const Struct = StructType(ref)

const MInt32 = ref.types.int32
const MUInt32 = ref.types.uint32
const MUInt8 = ref.types.uint8

// 版本信息
export const ASF_VERSION = Struct({
  Version: ref.types.CString,
  BuildDate: ref.types.CString,
  CopyRight: ref.types.CString,
})

const MRECT = Struct({
  left: MInt32,
  top: MInt32,
  right: MInt32,
  bottom: MInt32,
})

export const ASF_MultiFaceInfo = Struct({
  faceRect: ref.refType(MRECT),
  faceOrient: ref.refType(MInt32),
  faceNum: MInt32,
  faceID: ref.refType(MInt32),
})

export const ASVLOFFSCREEN = Struct({
  u32PixelArrayFormat: MUInt32,
  i32Width: MInt32,
  i32Height: MInt32,
  ppu8Plane: [ref.refType(MUInt8), 4],
  pi32Pitch: [MInt32, 4],
})
