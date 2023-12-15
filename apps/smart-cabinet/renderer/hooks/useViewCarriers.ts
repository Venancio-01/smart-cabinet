import type { DocDocumentProps, Prisma } from '@smart-cabinet/database'
import CarrierTable from '@/components/CarrierTable.vue'
import { useStore } from '@/store'
import { AlarmContentType, InPlaceState, OperationStatus } from '~/enums'

export default function () {
  const store = useStore()
  const { currentCabinet } = storeToRefs(store)

  const data = ref<DocDocumentProps[]>([])
  const total = ref(0)

  const getCarriers = async (pagination: PaginationType, condition: Partial<CarrierQueryProps>) => {
    const query: Prisma.DocDocumentWhereInput = {
      docName: condition.title
        ? {
            contains: condition.title,
          }
        : undefined,
      deptId: condition.deptId,
      cabinetId: currentCabinet.value?.id,
      cabinetDoorId: condition.cabinetDoorId,
    }

    if (condition.state !== undefined) {
      if (condition.state !== InPlaceState.MISPLACED) {
        query.docPStatus = condition.state
      }
      else {
        query.alarmRecord = {
          some: {
            contentType: AlarmContentType.IncorrectLocation,
            isOperation: OperationStatus.Unoperated,
          },
        }
      }
    }

    console.log('🚀 ~ file: useViewCarriers.ts:22 ~ getCarriers ~ query:', query)

    const { data: _data, total: _total } = await window.JSBridge.carrier.selectDocDocumentListWithPage(pagination, query)
    data.value = _data
    console.log('🚀 ~ file: useViewCarriers.ts:40 ~ getCarriers ~ _data:', _data)
    total.value = _total
  }

  return {
    data,
    total,
    getCarriers,
    CarrierTable,
  }
}
