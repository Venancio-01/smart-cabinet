import { Buffer } from 'buffer'
import { execSync } from 'child_process'
import { error, info } from '@smart-cabinet/common'

/**
 * @description: 十进制转二进制并补全 8 位，再颠倒顺序
 * @param {number} number
 * @return {*}
 */
export function convertDecimalToBinary(number: number) {
  const binary = number.toString(2)
  const binaryLength = binary.length
  const MAX_LENGTH = 8
  const binaryString =
    Array.from({ length: MAX_LENGTH - binaryLength })
      .fill('0')
      .join('') + binary
  const result = binaryString.split('').reverse().join('')

  return result
}

/**
 * @description: 生成锁控板命令
 * @param {string} source 锁控板命令
 * @return {*}
 */
export function generateLockCommand(source: string) {
  const arr = []
  for (let index = 0; index < source.length; index++) {
    if (index % 2 === 0) arr.push(`0x${source.slice(index, index + 2)}`)
  }

  const result = arr.reduce((acc, cur, index) => {
    if (index === 0) acc = cur
    else acc = `0x${(acc ^ cur).toString(16)}`

    return acc
  }, '')

  const command = [...arr, result]
    .map((item) => item.slice(2, 4))
    .join('')
    .toLocaleUpperCase()

  console.log('🚀 - generateLockCommand - command:', command)

  return Buffer.from(command, 'hex')
}

// 设置串口权限
export async function setPermissions() {
  if (import.meta.env.MODE !== 'sudo') return
  try {
    await execSync('sudo chmod 777 /dev/ttyUSB0')
    info('设置串口权限成功')
  } catch (e) {
    error(`设置串口权限失败,${e}`)
  }
}
