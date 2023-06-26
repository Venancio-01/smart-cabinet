import os from 'os'
import dayjs from 'dayjs'
import { debounce } from 'lodash-es'

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

/**
 * @description: 生成当前时间
 * @return {*}
 */
export function generateCurrentTime() {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

export interface PaginationType {
  page: number
  size: number
}

/**
 * @description: 获取分页的 skip 和 take
 * @param {Partial} pagination
 * @return {*}
 */
export function getSkipAndTake(pagination?: Partial<PaginationType>): {
  skip?: number
  take?: number
} | null {
  if (!pagination || !pagination.page || !pagination.size) return null

  const { page, size } = pagination
  return { skip: (page - 1) * size, take: size }
}

// 获取本机 ip 地址
export function getLocalIpAddress(): string[] {
  const interfaces = os.networkInterfaces()
  const addresses: string[] = []
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] ?? []) {
      if (iface.family === 'IPv4' && !iface.internal) addresses.push(iface.address)
    }
  }
  return addresses
}

/**
 * @description: 防抖函数
 * @param {array} args
 * @param {*} wait
 * @param {*} leading
 * @return {*}
 */
export function debouncedFunction<T extends (...args: any) => any>(func: T, wait = 300, leading = true) {
  return debounce<T>(func, wait, { leading })
}
