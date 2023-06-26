import { machineId } from 'node-machine-id'
import CryptoJS from 'crypto-js'

const key = 'liqingshan_hjrich'

/**
 * 加密
 * @param data 待加密数据
 * @returns string
 */
function hmacMd5Encrypt(data: string): string {
  return CryptoJS.HmacMD5(data, key).toString()
}

/**
 * @description: 生成注册码
 * @return {*}
 */
export async function generateRegistrationCode(): Promise<string> {
  const id = await machineId()
  return hmacMd5Encrypt(id)
}

/**
 * @description: 生成激活码
 * @return {*}
 */
export async function generateActivationCode(): Promise<string> {
  const registrationCode = await generateRegistrationCode()
  const activationCode = hmacMd5Encrypt(registrationCode)
  return activationCode
}

/**
 * @description: 比对激活码
 * @return {*}
 */
export async function compareActivationCode(activationCode: string): Promise<boolean> {
  const id = await machineId()
  const encrypted = hmacMd5Encrypt(hmacMd5Encrypt(id))
  return activationCode === encrypted
}
