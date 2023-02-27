import { useStore } from '@/store'
import { useCheckStore } from '@/store/check'
import { QUERY_OPEN_STATE_INTERVAL, SEND_QUERY_COMMAND_INTERVAL } from '@/config'
import useRfid from './useRfid'
import useDocument from './useDocument'

export default function () {
  const store = useStore()
  const { changeLockControlIsOnline, changeLockControlState, changeCabinetDoorData } = store
  const { cabinetData, cabinetDoorList, lockControlState } = storeToRefs(store)
  const checkStore = useCheckStore()
  const { addLastOperationCabinetDoorRecords } = checkStore
  const { takeStock } = useRfid()
  const { recordDataWhenCheckStart } = useDocument()

  // 查询锁孔开启状态的定时器
  const queryLockOpenStatusTimer = ref<number | null>(null)
  // 查询所有锁控状态的定时器
  const queryAllLockTimer = ref<number | null>(null)

  // 获取锁控板连接状态
  const getLockControlConnectState = async () => {
    if (cabinetData.value === null) return

    const { opendoor } = cabinetData.value
    if (opendoor === null) return

    const isConnected = await window.JSBridge.lockControl.getConnectState(opendoor)
    changeLockControlIsOnline(isConnected)
  }

  // 初始化锁控板连接
  const initLockControl = async () => {
    if (cabinetData.value === null) return

    const { opendoor, open_baudrate } = cabinetData.value
    if (opendoor === null) return

    await window.JSBridge.lockControl.init(opendoor, open_baudrate)
  }

  // 打开某个锁
  const openLock = async (lockNumber: number) => {
    const boardAddress = '01'
    const lockAddress = String(lockNumber).padStart(2, '0')
    await window.JSBridge.lockControl.open(boardAddress, lockAddress)
  }

  // 门锁开启状态
  const queryLockOpenStatus = async () => {
    const result = await window.JSBridge.lockControl.getOpenStatus()
    changeLockControlState(result)
  }

  const pollingQueryLockOpenStatus = () => {
    queryLockOpenStatus()
    queryLockOpenStatusTimer.value = window.setInterval(queryLockOpenStatus, QUERY_OPEN_STATE_INTERVAL)
  }

  const stopPollingQueryLockOpenStatus = () => {
    if (queryLockOpenStatusTimer.value) window.clearInterval(queryLockOpenStatusTimer.value)
  }

  // 查询所有锁状态
  const queryAllLockState = async () => {
    await window.JSBridge.lockControl.queryAllState()
  }

  // 轮询查询所有锁状态
  const pollingQueryAllLockState = () => {
    queryAllLockState()
    queryAllLockTimer.value = window.setInterval(() => {
      queryAllLockState()
    }, SEND_QUERY_COMMAND_INTERVAL)
  }

  // 停止轮询查询所有锁状态
  const stopPollingQueryAllLockState = () => {
    if (queryAllLockTimer.value) clearInterval(queryAllLockTimer.value)
  }

  const watchLockControlState = () => {
    watch(lockControlState, value => {
      if (value === null) return

      cabinetDoorList.value.forEach(door => {
        const isOpen = value[door.kgbh]

        if (door.isOpen && !isOpen && door.checkCountdown === 10) {
          console.log(`${door.kgbh} - 门锁关闭`)

          // 记录最后一次操作的柜门
          addLastOperationCabinetDoorRecords(door)

          // 记录盘点开始时的文件数据
          recordDataWhenCheckStart()
          takeStock(door.id)
          changeCabinetDoorData({ ...door, isOpen: false })
        } else if (isOpen) {
          console.log(`${door.kgbh} - 门锁开启`)
          changeCabinetDoorData({ ...door, isOpen: true })
        }
      })
    })
  }

  return {
    getLockControlConnectState,
    initLockControl,
    openLock,
    pollingQueryLockOpenStatus,
    stopPollingQueryLockOpenStatus,
    pollingQueryAllLockState,
    stopPollingQueryAllLockState,
    watchLockControlState
  }
}
