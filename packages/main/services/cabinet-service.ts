import prisma from '@/prisma'
import { rfid_cabinet_door } from '@prisma/client'

const cabinetService = {
  name: 'cabinet',
  fns: {
    /**
     * @description: 获取柜体信息
     * @return {*}
     */
    async getCabinetData() {
      const data = await prisma.rfid_cabinet.findFirst()
      return data
    },

    /**
     * @description: 获取柜门列表信息
     * @return {*}
     */
    async getCabinetDoorList(): Promise<rfid_cabinet_door[]> {
      const data = await prisma.rfid_cabinet_door.findMany()
      return data
    }
  }
}

export default cabinetService
