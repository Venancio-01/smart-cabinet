import { FINGER_POLLING_INTERVAL } from '@/config'

export default function () {
  // 注册指纹的定时器
  const registerTimer = ref<number | null>(null)
  // 识别指纹的定时器
  const identifyTimer = ref<number | null>(null)
  // 识别指纹结果
  const identifyResult = ref<null | ResponseProps>(null)
  // 注册指纹结果
  const registerResult = ref<null | ResponseProps>(null)

  const init = async () => {
    await window.JSBridge.finger.initSDK()
  }

  // 获取指纹仪连接状态
  const getConnectStatus = async () => {
    const isOnline = await window.JSBridge.finger.queryConnectState()
    return isOnline
  }

  // 打开指纹仪设备
  const openFingerDevice = async () => {
    const result = await window.JSBridge.finger.openDevice()
    console.log('打开指纹仪设备', result)
  }

  // 关闭指纹仪设备
  const closeFingerDevice = async () => {
    const result = await window.JSBridge.finger.closeDevice()
    console.log('关闭指纹仪设备', result)
  }

  // 开始注册指纹
  const startRegisterFinger = (userId: number, order: 1 | 2) => {
    const registerFingerFn = async () => {
      const result = await window.JSBridge.finger.handleRegister(userId, order)
      registerResult.value = result
    }
    registerFingerFn()
    registerTimer.value = window.setInterval(registerFingerFn, FINGER_POLLING_INTERVAL)
  }

  // 结束注册指纹
  const endRegisterFinger = () => {
    if (registerTimer.value) clearInterval(registerTimer.value)
  }

  // 开始识别指纹
  const startIdentifyFinger = () => {
    const identifyFingerFn = async () => {
      const result = await window.JSBridge.finger.handleIdentify()
      identifyResult.value = result
    }
    identifyFingerFn()
    identifyTimer.value = window.setInterval(identifyFingerFn, FINGER_POLLING_INTERVAL)
  }

  // 结束识别指纹
  const endIdentifyFinger = () => {
    if (identifyTimer.value) clearInterval(identifyTimer.value)
  }

  return {
    init,
    getConnectStatus,
    openFingerDevice,
    closeFingerDevice,
    startRegisterFinger,
    endRegisterFinger,
    startIdentifyFinger,
    endIdentifyFinger,
    identifyResult,
    registerResult,
  }
}
