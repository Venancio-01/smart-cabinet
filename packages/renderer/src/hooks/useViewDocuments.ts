import DocumentTable from '@/components/DocumentTable.vue'
import useDocument from '@/hooks/useDocument'
import { useStore } from '@/store'
import { doc_document } from '@prisma/client'

export default function () {
  const store = useStore()
  const { cabinetDoorList, misPlaceDocumentData } = storeToRefs(store)
  const { getDocumentData } = useDocument()

  const data = ref<doc_document[]>([])
  const total = ref(0)

  const getDocuments = async (condition: DocumentQueryProps) => {
    const result = await getDocumentData(condition)

    data.value = result.data.map(item => {
      const misPlaceDoorId = misPlaceDocumentData.value.reduce<null | number>(
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
    getDocuments,
    DocumentTable
  }
}
