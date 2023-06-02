import Buffer from 'buffer'
import {
  captureFingerImage,
  closeDeviceByHandle,
  destroyDeviceSDK,
  getDeviceCount,
  getParameterByHandle,
  initDeviceSDK,
  openDeviceByHandle,
} from './device-func'
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
} from './algorithm-func'
import { DeviceArrayType, IntType, TemplateType, UcharType } from './types'
import { MAX_DEVICE_NUM, MAX_REGISTRATION_COUNT, TEMPLATE_BYTE_LENGTH } from '@/config'
import { genResponseData } from '@/utils'
import { addFinger, queryFingerByUserIdAndOrder, updateFingerByUserIdAndOrder } from '@/database/methods/finger'
import { prisma } from '@/database'

// 指纹仪设备数组
const deviceList = new DeviceArrayType(MAX_DEVICE_NUM)
// 当前指纹仪在线状态
let connected = false
// 当前指纹仪开启状态
let isOpen = false
// 当前接入的指纹仪设备句柄
let deviceHandle = null
// 指纹图像数据
let imageBuffer = null
// 指纹设备宽高
let deviceWidth = 0
let deviceHeight = 0
// 算法句柄
let algorithmHandler = null
// 注册时，采集指纹数据数组
let registerTemplates = []
// 注册时，当前按压指纹次数索引
let registerCurrentIndex = 0

// 指纹对应的用户数据
let userFingerData = []

function initSDK() {
  checkFileExist()
  initDeviceSDK()
  initAlgorithmSDK()
}

function destroySDK() {
  destroyDeviceSDK()
  destroyAlgorithmSDK()
}

/**
 * @description: 查询当前设备在线情况
 * @return {*}
 */
function queryConnectState(): boolean {
  const count = getDeviceCount(deviceList, MAX_DEVICE_NUM)
  console.log('指纹仪连接数量：', count)
  connected = count > 0
  return connected
}

/**
 * @description: 打开指纹仪设备
 * @return {*}
 */
function openDevice() {
  if (!connected)
    return false
  if (isOpen)
    return true

  // 开启设备
  deviceHandle = openDeviceByHandle(deviceList[0].ref())

  // 获取设备参数
  getParameter()
  // 初始化算法
  algorithmHandler = initAlgorithm(deviceWidth, deviceHeight)

  const success = deviceHandle.deref() !== null && algorithmHandler.deref() !== null
  isOpen = success

  loadAllTemplate()

  return success
}

/**
 * @description: 关闭指纹仪设备
 * @return {*}
 */
function closeDevice() {
  if (!connected || !isOpen)
    return false

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
    registerTemplates = []
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
function startFingerCapture() {
  if (!connected || !isOpen)
    return false

  // 获取指纹仪捕获到的图像
  const result = captureFingerImage(deviceHandle, imageBuffer, deviceWidth * deviceHeight)
  if (result <= 0)
    return false

  const templateData = new UcharType(2048)
  // 提取图像
  const templateDataLen = extractTemplate(algorithmHandler, imageBuffer, deviceWidth, deviceHeight, templateData, 2048)

  if (templateDataLen <= 0)
    return false

  return templateData
}

async function handleRegister(userId, order) {
  let result = null
  const templateData = startFingerCapture()

  if (templateData)
    result = await onRegister(templateData, userId, order)

  return result
}

/**
 * @description: 注册指纹
 * @return {*}
 */
async function onRegister(templateData, userId, order) {
  const resetRegisterData = () => {
    registerCurrentIndex = 0
    registerTemplates = []
  }

  const { success: isRegistered } = onIdentify(templateData)
  if (isRegistered) {
    resetRegisterData()
    return genResponseData(false, '登记失败，当前手指已登记', { alert: true })
  }

  if (registerCurrentIndex >= MAX_REGISTRATION_COUNT) {
    resetRegisterData()
    return genResponseData(false)
  }

  if (registerCurrentIndex > 0) {
    // 对比前后两次采集的指纹
    const success = verifyTemplate(algorithmHandler, registerTemplates[registerCurrentIndex - 1], templateData)
    if (!success) {
      resetRegisterData()
      return genResponseData(false, '登记失败，请按压同一个手指', { alert: true })
    }
  }

  registerTemplates[registerCurrentIndex] = templateData
  registerCurrentIndex++

  if (registerCurrentIndex !== MAX_REGISTRATION_COUNT)
    return genResponseData(true, `您还需要按压${MAX_REGISTRATION_COUNT - registerCurrentIndex}次手指`)

  const regTemplates = new TemplateType(registerTemplates)
  const registerTemplateData = new UcharType(TEMPLATE_BYTE_LENGTH)
  const { success: genTempSuccess, result: genTempResult } = generateTemplate(
    algorithmHandler,
    regTemplates,
    MAX_REGISTRATION_COUNT,
    registerTemplateData,
  )

  if (!genTempSuccess) {
    resetRegisterData()
    return genResponseData(false, `生成登记模板失败，错误代码 = ${genTempResult}`, { alert: true })
  }
  const { success: addDbSuccess, result } = addTemplateToDb(algorithmHandler, 9999, genTempResult, registerTemplateData)

  if (!addDbSuccess) {
    resetRegisterData()
    return genResponseData(true, `添加指纹失败，错误代码 = ${result}`, { alert: true })
  }

  const fingerData = await queryFingerByUserIdAndOrder(userId, order)
  const data = registerTemplateData.buffer.toString('base64')
  const orderText = order === 1 ? '一' : '二'
  if (fingerData !== null) {
    try {
      await updateFingerByUserIdAndOrder(userId, order, data)
      resetRegisterData()
      return genResponseData(true, `指纹${orderText}更新成功`, { registerSuccess: true, alert: true })
    }
    catch (e) {
      resetRegisterData()
      return genResponseData(false, `指纹${orderText}更新失败`, { alert: true })
    }
  }
  else {
    try {
      await addFinger(userId, order, data)
      resetRegisterData()
      return genResponseData(true, `指纹${orderText}添加成功`, { registerSuccess: true, alert: true })
    }
    catch (e) {
      resetRegisterData()
      return genResponseData(false, `指纹${orderText}添加失败`, { alert: true })
    }
  }
}

/**
     * @description: 识别指纹
     * @return {*}
     */
function onIdentify(templateData) {
  const score = new IntType(1)
  const fingerId = new IntType(1)
  const result = identifyTemplate(algorithmHandler, templateData, fingerId, score)
  const success = result === 1
  const msg = success ? '识别成功!' : '识别失败'
  const fingerIndex = fingerId[0] - 1
  const userId = userFingerData[fingerIndex]?.user_id
  return genResponseData(success, msg, userId)
}

function handleIdentify() {
  let result = null
  const templateData = startFingerCapture()

  if (templateData)
    result = onIdentify(templateData)

  return result
}

/**
    * @description: 加载数据库指纹模板到内存
    * @return {*}
    */
async function loadAllTemplate() {
  userFingerData = await prisma.rfid_finger_user.findMany({
    select: {
      data: true,
      user_id: true,
    },
  })
  if (userFingerData.length === 0)
    return

  userFingerData.forEach((item, index) => {
    if (item.data) {
      const buf = Buffer.from(item.data, 'base64')
      addTemplateToDb(algorithmHandler, index + 1, TEMPLATE_BYTE_LENGTH, buf)
    }
  })
}

const fingerService = {
  name: 'finger' as const,
  fns: {
    initSDK,
    destroySDK,
    queryConnectState,
    openDevice,
    closeDevice,
    getParameter,
    startFingerCapture,
    handleRegister,
    onRegister,
    onIdentify,
    handleIdentify,
    loadAllTemplate,
  },
}

export default fingerService
