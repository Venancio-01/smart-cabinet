import { emitter } from '@smart-cabinet/utils'

let databaseIsConnected = false
emitter.on('database-connected', () => {
  databaseIsConnected = true
})

// 获取数据库连接状态
function getDatabaseConnectState() {
  return databaseIsConnected
}

const networkService = {
  name: 'network' as const,
  fns: {
    getDatabaseConnectState,
  },
}

export default networkService
