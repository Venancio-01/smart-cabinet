import { Library } from 'ffi-napi'
import { DeviceArrayType, DeviceTypePointerType, HandleType, UcharType } from './types'
import { DEVICE_SDK_PATH } from '@/config'

// 通过 ffi 解析 C++ SDK 方法
let deviceSDK = null

export function initDeviceSDK() {
  deviceSDK = Library(DEVICE_SDK_PATH, {
    sensorEnumDevices: ['int', [DeviceArrayType, 'int']], // 枚举设备
    sensorOpen: [HandleType, [DeviceTypePointerType]], // 打开设备
    sensorClose: ['int', [HandleType]], // 关闭设备
    sensorCapture: ['int', [HandleType, UcharType, 'int']], // 采集指纹
    sensorGetParameter: ['int', [HandleType, 'int']], // 获取指纹仪简单参数
  })
}

export function destroyDeviceSDK() {
  deviceSDK = null
}

export function getDeviceCount(deviceList: unknown[], max: number) {
  return deviceSDK.sensorEnumDevices(deviceList, max)
}

export function openDeviceByHandle(handle: unknown) {
  return deviceSDK.sensorOpen(handle)
}

export function closeDeviceByHandle(handle: unknown) {
  return deviceSDK.sensorClose(handle)
}

export function getParameterByHandle(handle: unknown, type: 1 | 2) {
  return deviceSDK.sensorGetParameter(handle, type)
}

export function captureFingerImage(handle: unknown, imageBuffer: unknown, size: number) {
  return deviceSDK.sensorCapture(handle, imageBuffer, size)
}
