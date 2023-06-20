import type { RfidCabinet, RfidCabinetdoor } from "database";
import { getLocalIpAddress } from "utils";
import { prisma } from "@/database";

let currentCabinet: RfidCabinet | null = null;

/**
 * @description: 获取当前 IP 对应的柜机信息
 * @return {*}
 */
async function getCurrentCabinet() {
  if (currentCabinet) return currentCabinet;

  const devices = await getCabinetData();
  const ipList = getLocalIpAddress();

  currentCabinet =
    devices.find((item) => item.cabAddr && ipList.includes(item.cabAddr)) ||
    null;

  return currentCabinet;
}

function getCabinetData(): Promise<RfidCabinet[]> {
  return prisma.rfidCabinet.findMany();
}

function getCabinetDoors(): Promise<RfidCabinetdoor[]> {
  return prisma.rfidCabinetdoor.findMany({
    where: {
      cabinetId: currentCabinet.id,
    },
  });
}

const cabinetService = {
  name: "cabinet" as const,
  fns: {
    getCabinetData,
    getCabinetDoors,
    getCurrentCabinet,
  },
};

export default cabinetService;
