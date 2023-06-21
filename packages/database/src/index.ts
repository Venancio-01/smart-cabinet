import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * @description: 连接数据库
 * @return {*}
 */
export async function connectDatabase() {
  let isConnected = false
  try {
    await prisma.$connect()
    isConnected = true
  } catch (e) {
    console.log('数据库连接失败', e)
  }

  return isConnected
}

export { prisma }
export * from '@prisma/client'
export * from './doc-check-log'
export * from './doc-check-result'
export * from './rfid-tips-alarm-record'
