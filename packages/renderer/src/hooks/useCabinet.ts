import { CHECK_TIME } from '@/config'
import { useStore } from '@/store'
import { useCheckStore } from '@/store/check'
import useLock from './useLock'
import useTime from './useTime'

export default function () {
  const router = useRouter()
  const store = useStore()
  const { setCabinetData, setCabinetDoorList, setCabinetDoor } = store
  const { lockControlIsOnline } = storeToRefs(store)
  const checkStore = useCheckStore()
  const { addLastOperationCabinetDoorRecords } = checkStore
  const { departmentList } = storeToRefs(store)
  const { openLock } = useLock()
  const { resetOperationTimeoutCountdown } = useTime()

  /**
   * @description: 获取柜体信息
   * @return {*}
   */
  const getCabinetInfo = async () => {
    const data = await window.JSBridge.cabinet.getCabinetData()
    setCabinetData(data)
  }

  /**
   * @description: 获取柜门信息
   * @return {*}
   */
  const getCabinetDoorInfo = async () => {
    const records = await window.JSBridge.cabinet.getCabinetDoorList()
    const list: CabinetDoorProps[] = []

    for (let index = 0; index < records.length; index++) {
      const item = records[index]

      list.push({
        ...item,
        departmentName: departmentList.value.find(department => department.id === Number(item.binding_id))?.dept_name,
        isOpen: false,
        checkCountdown: CHECK_TIME
      })
    }

    setCabinetDoorList(list)
  }

  // 打开柜门
  const openCabinetDoor = async (door: CabinetDoorProps) => {
    resetOperationTimeoutCountdown()

    if (lockControlIsOnline) {
      openLock(door.kgbh)
      addLastOperationCabinetDoorRecords(door)

      setTimeout(() => {
        setCabinetDoor({ ...door, isOpen: true })
      }, 1000)
    }

    router.push(`/open/${door.id}`)
  }

  const initCabinetData = async () => {
    return Promise.all([getCabinetInfo(), getCabinetDoorInfo()])
  }

  return {
    getCabinetInfo,
    getCabinetDoorInfo,
    initCabinetData,
    openCabinetDoor
  }
}
