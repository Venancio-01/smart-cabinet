import { connected } from '@/prisma'

const networkService = {
  name: 'network',
  fns: {
    getConnectState() {
      return connected
    }
  }
}

export default networkService
