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
  }
  catch (e) {
    console.log('数据库连接失败', e)
  }

  return isConnected
}

export { prisma }
export * from '@prisma/client'
export * from './doc-document'
export * from './rfid-cabinet'
export * from './rfid-cabinet-door'
export * from './rfid-finger-user'
export * from './rfid-card-user'
export * from './rfid-tips-alarm-record'
export * from './sys-user'
export * from './sys-dept'
export * from './sys-role'
export * from './sys-user-role'
export * from './door-access-record'
export * from './door-alarm-record'
export * from './door-rfid-record'
export * from './door-rfid-register'
export * from './door-equipment'
