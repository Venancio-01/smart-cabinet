import { join } from 'path'

const isDev = import.meta.env.MODE === 'development'

// 红外检测的间隔阈值，单位，毫秒
export const INTERVAL_THRESHOLD = 2500

// 红外检测时间最大阈值，单位，毫秒
export const DETECTION_DURATION = 1500

// 离开方向, 1to2: GPI1 到 GPI2, 2to1: GPI2 到 GPI1
export const DIRECTION_LEAVE = '1to2'

// UNIX 套接字通讯地址
export const UPDATE_SERVICE_SOCKET_PATH = '/tmp/hjrich-update-service.sock'

// CRC SDK 路径
export const CRC_SDK_PATH = isDev ? 'public/crc-lib/libCRC16_CCITT.so' : join(process.resourcesPath, '/public/crc-lib/libCRC16_CCITT.so')
// // CRC SDK 路径 - windows
// export const CRC_SDK_PATH = isDev ? 'public/crc-lib/CRC16_CCITT_WIN' : join(process.resourcesPath, '/public/crc-lib/CRC16_CCITT_WIN')

// 环境变量文件路径
export const EVN_FILE_PATH = isDev ? 'src/main/database/.env' : join(process.resourcesPath, '.env')

// 图标文件路径
export const ICON_PATH = isDev ? 'public/favicon.ico' : join(process.resourcesPath, '/public/favicon.ico')
