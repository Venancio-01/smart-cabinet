function getConnectState() {
  return globalThis.databaseIsConnected
}

const networkService = {
  name: 'network' as const,
  fns: {
    getConnectState,
  },
}

export default networkService
