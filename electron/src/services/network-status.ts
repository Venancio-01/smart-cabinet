import { connected } from '@/prisma'

const getConnectState = () => {
  return connected
}

const networkService = {
  name: 'network' as const,
  fns: {
    getConnectState
  }
}

export default networkService

