import { PrismaClient } from 'database'
import logServices from '@/services/log'

let prisma
let isConnected = false

try {
  prisma = new PrismaClient()
  isConnected = true
}
catch (e) {
  logServices.fns.error(`${e}, 数据库连接失败`)
  isConnected = false
}

export default prisma as PrismaClient
export { isConnected }
