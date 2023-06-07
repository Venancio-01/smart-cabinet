import type { doc_document } from '@prisma/client'
import CarrierTable from '@/components/CarrierTable.vue'
import useCarrier from '@/hooks/useCarrier'
import { useStore } from '@/store'

export default function () {
  const store = useStore()
  const { cabinetDoorList, misPlaceCarrierData } = storeToRefs(store)
  const { getCarriersByCondition } = useCarrier()

  const data = ref<doc_document[]>([])
  const total = ref(0)

  const getCarriers = async (condition: CarrierQueryProps) => {
    const result = await getCarriersByCondition(condition)

    data.value = result.data.map((item) => {
      const misPlaceDoorId = misPlaceCarrierData.value.reduce<null | number>(
        (acc, cur) => (cur.operationID === item.doc_rfid ? cur.CabinetDoorId : acc),
        null,
      )
      const misPlaceDoorName = cabinetDoorList.value.find(item => item.id === misPlaceDoorId)?.viewName || ''
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
