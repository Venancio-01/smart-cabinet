import { isConnected } from "@/database";

function getConnectState() {
  return isConnected;
}

const networkService = {
  name: "network" as const,
  fns: {
    getConnectState,
  },
};

export default networkService;
