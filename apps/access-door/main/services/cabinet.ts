import type { RfidCabinetdoor } from "database";
import prisma from "@/database";

/**
 * @description: 获取柜体信息
 * @return {*}
 */
async function getCabinetData() {
  const data = await prisma.rfid_cabinet.findFirst();
  return data;
}

/**
 * @description: 获取柜门列表信息
 * @return {*}
 */
async function getCabinetDoorList(): Promise<rfid_cabinet_door[]> {
  const data = await prisma.rfid_cabinet_door.findMany();
  return data;
}

const cabinetService = {
  name: "cabinet" as const,
  fns: {
    getCabinetData,
    getCabinetDoorList,
  },
};

export default cabinetService;
