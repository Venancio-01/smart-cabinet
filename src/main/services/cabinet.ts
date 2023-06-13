import type { RfidCabinet, RfidCabinetdoor } from "@prisma/client";
import { prisma } from "@/database";
import { getLocalIpAddress } from "@/utils";

let currentCabinet: RfidCabinet | null = null;

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
