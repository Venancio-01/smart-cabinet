import type { DoorEquipment } from '@prisma/client'
import { prisma } from '..'

/**
 * @description: 查询通道门列表
 * @return {*}
 */
export function selectDoorEquipmentList(): Promise<DoorEquipment[]> {
  return prisma.doorEquipment.findMany()
}
