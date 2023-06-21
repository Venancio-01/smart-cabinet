function getConnectState() {
  return global.databaseIsConnected
}

const networkService = {
  name: 'network' as const,
  fns: {
    getConnectState,
  },
}

export default networkService
