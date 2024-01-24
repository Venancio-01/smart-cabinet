function getNetworkConnectionStatus() {
  return globalThis.databaseIsConnected
}

const networkService = {
  name: 'network' as const,
  fns: {
    getNetworkConnectionStatus,
  },
}

export default networkService
