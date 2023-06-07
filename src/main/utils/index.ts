import os from 'os'
import dayjs from 'dayjs'
import pkg from '../../../package.json'

/**
 * @description: 生成 ipc 通信的返回数据结构
 * @param {*} T
 * @return {*}
 */
export function genResponseData<T>(success: boolean, msg?: string, data?: T) {
  return {
    success,
    msg,
    data,
  }
}

export function generateCurrentTime() {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

/**
 * @description: 获取应用版本信息
 * @return {*}
 */
export function getAppVersion(): string {
  return pkg.version
}

// 获取本机 ip 地址
export function getLocalIpAddress(): string[] {
  const interfaces = os.networkInterfaces()
  const addresses: string[] = []
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] ?? []) {
      if (iface.family === 'IPv4' && !iface.internal)
        addresses.push(iface.address)
    }
  }
  return addresses
}
