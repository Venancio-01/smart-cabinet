import { Buffer } from 'buffer'
import { Library } from 'ffi-napi'
import { CRC_SDK_PATH } from '@smart-cabinet/utils/config'
import { UcharType } from '@smart-cabinet/utils'

export function parseRFIDReportData(data: string): string[] {
  const PREFIX = '5a00011200'
  const arr = data.split(PREFIX)

  const parseArr = arr.reduce((acc, cur) => {
    if (cur.startsWith('00')) {
      const length = Number.parseInt(`0x${cur.substring(0, 4)}`, 16) * 2
      acc.push(`${PREFIX}${cur.substring(0, 4 + length)}`)
    }

    return acc
  }, [] as string[])

  return parseArr
}

/**
 * @description: 从 RFID 读取器上报命令中获取 EPC 和 TID
 * @param {string} command
 * @return {*}
 */
export function getTIDByReportData(data: string) {
  let str = data
  const PREFIX = '5a00011200'
  const TIDLengthCommandLength = 4
  const MidCommandLength = 16

  str = str.replace(PREFIX, '')

  const EPCLength = Number.parseInt(`0x${str.substring(4, 8)}`, 16) * 2
  const TIDLength
    = Number.parseInt(`0x${str.substring(8 + EPCLength + MidCommandLength, 8 + EPCLength + MidCommandLength + TIDLengthCommandLength)}`, 16)
    * 2

  const TID = str.substring(
    8 + EPCLength + MidCommandLength + TIDLengthCommandLength,
    8 + EPCLength + MidCommandLength + TIDLengthCommandLength + TIDLength,
  )

  return TID
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
  const hex = Number.parseInt(binary, 2).toString(16).toUpperCase()
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

export function generateAntennaCommand(antennaIds: number[]) {
  const binary = generateBinaryString(antennaIds)
  const command = binaryToHex(binary)
  return command
}
