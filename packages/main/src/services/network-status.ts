import { connected } from '@/prisma'

const networkService = {
  name: 'network' as const,
  fns: {
    getConnectState() {
      return connected
    }
  }
}

export default networkService
