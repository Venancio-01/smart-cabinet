import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient = null
let connected = false

try {
  prisma = new PrismaClient()
  connected = true
}
catch (e) {
  console.log(e, '数据库连接失败')
  connected = false
}

export default prisma
export { connected }
