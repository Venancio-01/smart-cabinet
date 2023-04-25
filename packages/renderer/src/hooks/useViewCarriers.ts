import CarrierTable from '@/components/CarrierTable.vue'
import useCarrier from '@/hooks/useCarrier'
import { useStore } from '@/store'
import { doc_document } from '@prisma/client'

export default function () {
  const store = useStore()
  const { cabinetDoorList, misPlaceCarrierData } = storeToRefs(store)
  const { getCarrierDataByCondition } = useCarrier()

  const data = ref<doc_document[]>([])
  const total = ref(0)

  const getCarriers = async (condition: CarrierQueryProps) => {
    const result = await getCarrierDataByCondition(condition)

    data.value = result.data.map(item => {
      const misPlaceDoorId = misPlaceCarrierData.value.reduce<null | number>(
        (acc, cur) => (cur.operation_id === item.doc_rfid ? cur.cabinet_door_id : acc),
        null
      )
      const misPlaceDoorName = cabinetDoorList.value.find(item => item.id === misPlaceDoorId)?.view_name || ''
      return {
        ...item,
        misPlaceDoorName
      }
    })
    total.value = result.total
  }

  return {
    data,
    total,
    getCarriers,
    CarrierTable
  }
}
