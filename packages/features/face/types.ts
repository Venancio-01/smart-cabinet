import ref from 'ref-napi'
import ArrayType from 'ref-array-di'
import StructType from 'ref-struct-di'

export const CArray = ArrayType(ref)
export const CStruct = StructType(ref)

export const ASF_VERSION = CStruct({
  Version: ref.types.CString,
  BuildDate: ref.types.CString,
  CopyRight: ref.types.CString,
})

export const HandleType = ref.refType(ref.types.uint)
