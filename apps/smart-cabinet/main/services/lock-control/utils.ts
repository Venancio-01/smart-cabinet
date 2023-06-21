import { Buffer } from 'buffer'
import { execSync } from 'child_process'

/**
 * @description: 十进制转二进制并补全 8 位，再颠倒顺序
 * @param {number} number
 * @return {*}
 */
export function convertDecimalToBinary(number: number) {
  const binary = number.toString(2)
  const binaryLength = binary.length
  const MAX_LENGTH = 8
  const binaryString = new Array(MAX_LENGTH - binaryLength).fill('0').join('') + binary
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

  return Buffer.from(command, 'hex')
}

// 设置串口权限
export async function setPermissions() {
  try {
    await execSync('sudo chmod 777 /dev/ttyUSB0')
    console.log('设置串口权限成功')
  } catch (error) {
    console.log('设置串口权限失败')
  }
}
