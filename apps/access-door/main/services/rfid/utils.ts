import { Library } from 'ffi-napi'
import ref from 'ref-napi'
import ArrayType from 'ref-array-di'
import { CRC_SDK_PATH } from 'utils/config/main'

const CArray = ArrayType(ref)
const UcharType = CArray(ref.types.uchar)

/**
 * @description: 生成 RFID 命令
 * @param {string} command
 * @return {*}
 */
export function generateCommand(command: string) {
  const FH = '5A'
  const body = command
  const checkCode = generateCRC16Code(body).padStart(4, '0')
  return Buffer.from(FH + body + checkCode, 'hex')
}

/**
 * @description: 根据数组数组生成对应索引为 1 的二进制字符串
 * @param {number} numbers
 * @return {*}
 */
export function generateBinaryString(numbers: number[]) {
  const binaryArray = Array.from({ length: 32 }, () => '0')

  for (const num of numbers) binaryArray[num - 1] = '1'

  return binaryArray.reverse().join('')
}

/**
 * @description: 二进制字符串转十六进制字符串，长度为8，补0
 * @param {string} binary
 * @return {*}
 */
export function binaryToHex(binary: string): string {
  const hex = parseInt(binary, 2).toString(16).toUpperCase()
  return hex.padStart(8, '0')
}

/**
 * @description: 生成 CRC16 校验码
 * @param {string} str
 * @return {*}
 */
export function generateCRC16Code(str: string) {
  const crcSDK = Library(CRC_SDK_PATH, {
    CRC16_CCITT: ['int', [UcharType, 'int']],
  })
  const buffer = Buffer.from(str, 'hex')
  return crcSDK.CRC16_CCITT(buffer, buffer.length).toString(16)
}

/**
 * 生成天线命令
 * @param antennaIds 天线 ID 数组
 * @returns 命令字符串
 */
export function generateAntennaCommand(antennaIds: number[]) {
  const binary = generateBinaryString(antennaIds)
  const command = binaryToHex(binary)
  return command
}
