import { connected } from '@/database'

function getConnectState() {
  return connected
}

const networkService = {
  name: 'network' as const,
  fns: {
    getConnectState,
  },
}

export default networkService
