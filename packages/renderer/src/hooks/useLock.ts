import { useStore } from '@/store'
import { QUERY_OPEN_STATE_INTERVAL, SEND_QUERY_COMMAND_INTERVAL } from '@/config'
import useRfid from './useRfid'
import useCheck from './useCheck'

export default function () {
  const store = useStore()
  const { changeLockControlIsOnline, changeLockCommandInterval, changeLockControlState } = store
  const { lockCommandInterval } = storeToRefs(store)
  const { watchLockControlState } = useCheck()

  // 查询锁孔开启状态的定时器
  const queryLockOpenStatusTimer = ref<number | null>(null)
  // 查询所有锁控状态的定时器
  const queryAllLockTimer = ref<number | null>(null)

  // 获取锁控板连接状态
  const getLockControlConnectState = async () => {
    const isConnected = await window.JSBridge.lockControl.getConnectState()
    changeLockControlIsOnline(isConnected)
  }

  // 初始化锁控板连接
  const initLockControl = async () => {
    await window.JSBridge.lockControl.init()
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

  return {
    getLockControlConnectState,
    initLockControl,
    openLock,
    pollingQueryLockOpenStatus,
    stopPollingQueryLockOpenStatus,
    pollingQueryAllLockState,
    stopPollingQueryAllLockState
  }
}
