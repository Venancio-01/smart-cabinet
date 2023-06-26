import type { DocDocument, Prisma } from 'database'
import CarrierTable from '@/components/CarrierTable.vue'
import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const { cabinetDoorList, misPlaceCarrierList } = storeToRefs(store)

  const data = ref<DocDocument[]>([])
  const total = ref(0)

  const getCarriers = async (pagination: PaginationType, condition: Partial<DocDocument>) => {
    const query: Prisma.DocDocumentWhereInput = {
      ...condition,
      docName: {
        contains: condition.docName,
      },
    }
    const result = await window.JSBridge.carrier.selectDocDocumentListWithPage(pagination, query)

    data.value = result.data.map((item) => {
      const misPlaceDoorId = misPlaceCarrierList.value.reduce((acc, cur) => {
        if (cur.operationId === item.docRfid && cur.cabinetDoorId) acc = cur.cabinetDoorId

        return acc
      }, '')
      const misPlaceDoorName = cabinetDoorList.value.find((item) => item.id === Number(misPlaceDoorId))?.viewName || ''
      return {
        ...item,
        misPlaceDoorName,
      }
    })
    total.value = result.total
  }

  return {
    data,
    total,
    getCarriers,
    CarrierTable,
  }
}
