import { connectDatabase } from '@smart-cabinet/database'
import { error, info } from './log'

// 连接数据库
export async function initDatabase() {
  try {
    const isConnected = await connectDatabase()
    globalThis.databaseIsConnected = isConnected
    info('数据库连接成功')
  }
  catch (e) {
    error(`数据库连接失败${e}`)
  }
}
