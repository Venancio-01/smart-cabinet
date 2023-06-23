import { machineId } from 'node-machine-id'
import CryptoJS from 'crypto-js'

const key = 'liqingshan_hjrich'

/**
 * 获取机器ID
 * @returns Promise<string>
 */
export async function getDeskId(){
  return machineId()
}

/**
 * 加密
 * @param data 待加密数据
 * @returns string
 */
export function hmacMd5Encrypt(data: string): string {
  return CryptoJS.HmacMD5(data, key).toString()
}
