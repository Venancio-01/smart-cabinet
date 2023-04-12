import { join } from 'path'

const isDev = false

// 设备最大连接数
export const MAX_DEVICE_NUM = 16
// 指纹登记次数
export const MAX_REGISTRATION_COUNT = 3
// 指纹模板字节数
export const TEMPLATE_BYTE_LENGTH = 2048
// 对比两个指纹后打分的阈值，低于 50 说明两个指纹不相同
export const VERIFY_SCORE_THRESHOLD = 50

// 指纹设备 SDK 路径
export const DEVICE_SDK_PATH = isDev
  ? 'packages/main/public/finger-lib/libzkfpcap.so'
  : join(process.resourcesPath, '/public/finger-lib/libzkfpcap.so')

// 指纹算法 SDK 路径
export const ALGORITHM_SDK_PATH = isDev
  ? 'packages/main/public/finger-lib/libzkfp.so'
  : join(process.resourcesPath, '/public/finger-lib/libzkfp.so')

// CRC SDK 路径
export const CRC_SDK_PATH = isDev
  ? 'packages/main/public/crc-lib/libCRC16_CCITT.so'
  : join(process.resourcesPath, '/public/crc-lib/libCRC16_CCITT.so')
