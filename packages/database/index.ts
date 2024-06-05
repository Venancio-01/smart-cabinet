import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * @description: 连接数据库
 * @return {*}
 */
export async function connectToDatabase() {
  return prisma.$connect()
}

export { prisma }
export * from '@prisma/client'
export * from './src/doc-document'
export * from './src/rfid-cabinet'
export * from './src/rfid-cabinet-door'
export * from './src/rfid-finger-user'
export * from './src/rfid-card-user'
export * from './src/rfid-tips-alarm-record'
export * from './src/sys-user'
export * from './src/sys-dept'
export * from './src/sys-role'
export * from './src/sys-user-role'
export * from './src/door-access-record'
export * from './src/door-alarm-record'
export * from './src/door-rfid-record'
export * from './src/door-rfid-register'
export * from './src/door-equipment'
