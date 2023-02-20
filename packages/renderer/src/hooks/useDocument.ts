import { useStore } from '@/store'
import createAlert from '@/components/BaseAlert'
import { doc_document } from '@prisma/client'

export default function () {
  const store = useStore()
  const { saveMisPlaceDocumentData, saveDocumentList } = store
  const { user } = storeToRefs(store)

  const getAllDocumentData = async () => {
    const documents = await window.JSBridge.document.getAllDocumentData()
    saveDocumentList(documents)
  }

  const getDocumentData = async (condition: DocumentQueryProps) => {
    return await window.JSBridge.document.getDocumentData({ ...condition })
  }

  /**
   * @description: 根据柜门 ID 获取文件数据
   * @param {number} cabinetId 柜门 ID
   * @return {*}
   */
  const getDocumentByCabinetId = async (cabinetId: number) => {
    return await window.JSBridge.document.getDocumentByCabinetId(cabinetId)
  }

  /**
   * @description: 获取在位文件数量
   * @param {number} cabinetId 柜门 ID
   * @return {*}
   */
  const getInPlaceDocumentCount = async (cabinetId?: number) => {
    return await window.JSBridge.document.getInPlaceDocumentCount(cabinetId)
  }

  /**
   * @description: 获取错放文件数据
   * @return {*}
   */
  const getMisPlaceDocuments = async () => {
    const data = await window.JSBridge.document.getMisPlaceDocuments()
    saveMisPlaceDocumentData(data)
    return data
  }

  /**
   * @description: 根据 RFID 读取器读取到的数据更新文件状态
   * @return {*}
   */
  const updateDocumentStatus = async (door: CabinetDoorProps) => {
    const user_id = user.value?.id
    await window.JSBridge.document.updateDocumentStateAfterCheck({ ...door }, user_id)
  }

  const generateCheckResult = async ({
    beforeDocuments,
    afterDocuments,
    beforeMisPlaceDocumentCount,
    afterMisPlaceDocumentCount
  }: {
    beforeDocuments: doc_document[]
    afterDocuments: doc_document[]
    beforeMisPlaceDocumentCount: number
    afterMisPlaceDocumentCount: number
  }) => {
    let lendCount = 0
    let returnCount = 0
    const misPlaceDocumentCount =
      afterMisPlaceDocumentCount > beforeMisPlaceDocumentCount ? afterMisPlaceDocumentCount - beforeMisPlaceDocumentCount : 0

    beforeDocuments.forEach(item => {
      afterDocuments.forEach(subItem => {
        if (item.doc_id !== subItem.doc_id) return
        if (item.doc_reissue_number === 0 && subItem.doc_reissue_number === 1) lendCount++
        if (item.doc_reissue_number === 1 && subItem.doc_reissue_number === 0) returnCount++
      })
    })

    if (lendCount === 0 && returnCount === 0 && misPlaceDocumentCount === 0) createAlert('盘点成功，柜内文件无变化')
    else
      createAlert(`盘点成功，本次借出文件数量：${lendCount},归还文件数量：${returnCount}，错位文件数量：${misPlaceDocumentCount}`)
  }

  return {
    getDocumentData,
    getAllDocumentData,
    getMisPlaceDocuments,
    updateDocumentStatus,
    generateCheckResult,
    getDocumentByCabinetId,
    getInPlaceDocumentCount,
  }
}
