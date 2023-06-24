import { prisma } from '.'

/**
 * @description: 查询通道门列表
 * @return {*}
 */
export function selectDoorEquipmentList() {
  return prisma.doorEquipment.findMany()
}
