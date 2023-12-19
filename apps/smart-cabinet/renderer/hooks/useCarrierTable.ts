import type { DocDocumentProps, Prisma } from '@smart-cabinet/database'
import { CARRIER_EVENT_NAME } from '#/ipcNames'
import CarrierTable from '@/components/CarrierTable.vue'

import { AlarmContentType, InPlaceState, OperationStatus } from '~/enums'
import { useGlobalState } from '@/store'

export default function () {
  const { currentCabinet } = useGlobalState()

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

    const result = await window.electronApi.ipcRenderer.invoke(CARRIER_EVENT_NAME.selectDocDocumentListWithPage, pagination, query)
    data.value = result.data
    total.value = result.total
  }

  return {
    data,
    total,
    getCarriers,
    CarrierTable,
  }
}
