import { debounce } from 'lodash-es'

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

/**
 * @description: 防抖函数
 * @param {Array} args
 * @param {*} wait
 * @param {*} leading
 * @return {*}
 */
export function debouncedFunction<T extends (...args: any) => any>(func: T, wait = 300, leading = true) {
  return debounce<T>(func, wait, { leading })
}

export * from './config'
export * from './electron'
export * from './message'
export * from './socket'
export * from './mitt'
export * from './napi'
export * from './serialport'
export * from './common'
