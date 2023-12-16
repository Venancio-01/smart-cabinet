import { Buffer } from 'buffer'
import { DeviceArrayType, IntType, TemplateType, UcharType, genResponseData } from '@smart-cabinet/utils'
import { MAX_DEVICE_NUM, MAX_REGISTRATION_COUNT, TEMPLATE_BYTE_LENGTH } from '@smart-cabinet/utils/config'
import { info } from '@smart-cabinet/common'
import {
  captureFingerImage,
  closeDeviceByHandle,
  destroyDeviceSDK,
  getDeviceCount,
  getParameterByHandle,
  initDeviceSDK,
  openDeviceByHandle,
} from './device'
import {
  addTemplateToDb,
  checkFileExist,
  closeAlgorithm,
  destroyAlgorithmSDK,
  extractTemplate,
  generateTemplate,
  identifyTemplate,
  initAlgorithm,
  initAlgorithmSDK,
  verifyTemplate,
} from './algorithm'

// 指纹仪设备数组
const deviceList = new DeviceArrayType(MAX_DEVICE_NUM)
// 当前指纹仪在线状态
const connected = false
// 当前指纹仪开启状态
let isOpen = false
// 当前接入的指纹仪设备句柄
let deviceHandle: any = null
// 指纹图像数据
let imageBuffer: any = null
// 指纹设备宽高
let deviceWidth = 0
let deviceHeight = 0

// 算法句柄
let algorithmHandler: any = null
// 注册时，采集指纹数据数组
let registerFingerprintTemplateList: any[] = []
// 注册时，当前按压指纹次数索引
let registerCurrentIndex = 0

/**
 * @description: 初始化指纹仪 sdk
 * @return {*}
 */
export function initFingerprintSDK() {
  // 检查 sdk 文件是否存在
  checkFileExist()
  // 初始化指纹仪 sdk
  initDeviceSDK()
  // 初始化算法 sdk
  initAlgorithmSDK()
}

/**
 * @description: 销毁指纹仪 sdk
 * @return {*}
 */
export function destroyFingerprintSDK() {
  destroyDeviceSDK()
  destroyAlgorithmSDK()
}

/**
 * @description: 查询指纹仪连接状态
 * @return {*}
 */
export function getFingerprintConnectionStatus(): boolean {
  const count = getDeviceCount(deviceList, MAX_DEVICE_NUM)
  info(`指纹仪连接数量：${count}`)

  return count > 0
}

/**
 * @description: 打开指纹仪
 * @return {*}
 */
export function openFingerprint() {
  // 开启设备
  deviceHandle = openDeviceByHandle(deviceList[0].ref())
  // 获取设备参数
  getParameter()
  // 初始化算法
  algorithmHandler = initAlgorithm(deviceWidth, deviceHeight)

  const success = deviceHandle.deref() !== null && algorithmHandler.deref() !== null

  return success
}

/**
 * @description: 关闭指纹仪设备
 * @return {*}
 */
export function closeDevice() {
  // 关闭设备
  const deviceCloseResult = closeDeviceByHandle(deviceHandle)
  // 关闭算法
  const algorithmCloseResult = closeAlgorithm(algorithmHandler)

  const success = deviceCloseResult === 0 && algorithmCloseResult === 1
  // 重置指纹仪相关变量
  if (success) {
    isOpen = false
    deviceHandle = null
    imageBuffer = null
    deviceWidth = 0
    deviceHeight = 0
    algorithmHandler = null
    registerFingerprintTemplateList = []
    registerCurrentIndex = 0
  }

  return success
}

/**
 * @description: 获取指纹仪宽高
 * @return {*}
 */
function getParameter() {
  deviceWidth = getParameterByHandle(deviceHandle, 1)
  deviceHeight = getParameterByHandle(deviceHandle, 2)
  imageBuffer = new UcharType(deviceWidth * deviceHeight)
}

/**
 * @description: 开始采集指纹
 * @return {*}
 */
export function startFingerprintCapture() {
  if (!connected || !isOpen) return false

  // 获取指纹仪捕获到的图像
  const result = captureFingerImage(deviceHandle, imageBuffer, deviceWidth * deviceHeight)
  if (result <= 0) return false

  const templateData = new UcharType(2048)
  // 提取图像
  const templateDataLen = extractTemplate(algorithmHandler, imageBuffer, deviceWidth, deviceHeight, templateData, 2048)

  if (templateDataLen <= 0) return false

  return templateData
}

/**
 * @description: 注册指纹
 * @param {string} fingerprintData 指纹数据
 * @return {*}
 */
export async function registerFingerprint(fingerprintData: string) {
  let type: 'error' | 'unfinished' | 'finished' | '' = ''
  let msg = ''
  let data: null | string = null

  // 重置注册数据
  const resetRegisterData = () => {
    registerCurrentIndex = 0
    registerFingerprintTemplateList = []
  }

  const isRegistered = recognizeFingerprint(fingerprintData)

  if (isRegistered) {
    resetRegisterData()

    msg = '登记失败，当前手指已登记'
    type = 'error'
    return {
      type,
      msg,
      data,
    }
  }

  // 采集指纹次数超过最大次数，重置注册数据
  if (registerCurrentIndex >= MAX_REGISTRATION_COUNT) {
    resetRegisterData()
  }

  if (registerCurrentIndex > 0) {
    // 对比前后两次采集的指纹
    const success = verifyTemplate(algorithmHandler, registerFingerprintTemplateList[registerCurrentIndex - 1], fingerprintData)
    if (!success) {
      resetRegisterData()

      msg = '登记失败，两次采集的指纹不一致'
      return {
        success,
        msg,
        data,
      }
    }
  }

  // 保存采集的指纹数据
  registerFingerprintTemplateList[registerCurrentIndex] = fingerprintData
  registerCurrentIndex++

  if (registerCurrentIndex !== MAX_REGISTRATION_COUNT) {
    type = 'unfinished'
    msg = `您还需要按压${MAX_REGISTRATION_COUNT - registerCurrentIndex}次手指`
    return {
      type,
      msg,
      data,
    }
  }

  const regTemplates = new TemplateType(registerFingerprintTemplateList)
  const registerTemplateData = new UcharType(TEMPLATE_BYTE_LENGTH)
  const { success: generateTemplateSuccess, result: genTempResult } = generateTemplate(
    algorithmHandler,
    regTemplates,
    MAX_REGISTRATION_COUNT,
    registerTemplateData,
  )

  if (!generateTemplateSuccess) {
    resetRegisterData()

    type = 'error'
    msg = `生成登记模板失败，错误代码 = ${genTempResult}`

    return {
      type,
      msg,
      data,
    }
  }

  // 添加指纹模板到数据库
  const { success: addDbSuccess, result } = addTemplateToDb(algorithmHandler, 9999, genTempResult, registerTemplateData)

  if (!addDbSuccess) {
    resetRegisterData()

    type = 'error'
    msg = `添加指纹失败，错误代码 = ${result}`
    return {
      type,
      msg,
      data,
    }
  }

  data = registerTemplateData.buffer.toString('base64')
  return {
    type: 'finished',
    msg: '登记成功',
    data,
  }
}

/**
 * @description: 识别指纹
 * @param {*} templateData
 * @return {boolean} success
 */
export function recognizeFingerprint(templateData): boolean {
  const score = new IntType(1)
  const fingerId = new IntType(1)
  const result = identifyTemplate(algorithmHandler, templateData, fingerId, score)
  const success = result === 1

  return success
}

/**
 * @description: 加载指纹模板
 * @param {string[]} fingerprintList 指纹模板数组
 * @return {*}
 */
export async function loadFingerprintTemplate(fingerprintList: string[]) {
  fingerprintList.forEach((item, index) => {
    const buf = Buffer.from(item, 'base64')
    addTemplateToDb(algorithmHandler, index + 1, TEMPLATE_BYTE_LENGTH, buf)
  })
}
