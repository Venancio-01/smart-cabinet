import { isConnected } from "@/database";

/**
 * 获取连接状态
 * @returns {boolean} 连接状态
 */
function getConnectState(): boolean {
  return isConnected;
}

const networkService = {
  name: "network" as const,
  fns: {
    getConnectState,
  },
};

export default networkService;
