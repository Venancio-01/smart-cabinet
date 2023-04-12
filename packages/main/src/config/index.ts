import { join } from 'path'

const isDev = false

export const RFID_ADDRESS = '192.168.1.181'
export const RFID_PORT = 8899

export const SERVICE_PATH = '/home/js/Project/go/src/hjrich-update-service/hjrich-update-service'
export const UPDATE_SERVICE_SOCKET_PATH = '/tmp/hjrich-update-service.sock'

// 环境变量文件路径
export const EVN_FILE_PATH = isDev ? 'packages/main/src/prisma/.env' : join(process.resourcesPath, '.env')
console.log("🚀 ~ file: index.ts:13 ~ EVN_FILE_PATH:", EVN_FILE_PATH)
