import { MD5 } from 'crypto-js'
import dayjs from 'dayjs'

/**
 * @description: 生成 ipc 通信的返回数据结构
 * @param {*} T
 * @return {*}
 */
export const genResponseData = <T>(success: boolean, msg?: string, data?: T) => {
  return {
    success,
    msg,
    data
  }
}

/**
 * @description: 生成 md5 加密后的密码
 * @param {string} username
 * @param {string} password
 * @param {string} salt
 * @return {*}
 */
export const genMd5EncryptedPassword = (username: string, password: string, salt: string) => {
  return MD5(username + password + salt).toString()
}

export const parseRFIDReportData = (data: string): string[] => {
  const PREFIX = '5a00011200'
  const arr = data.split(PREFIX)

  const parseArr = arr.reduce((acc, cur) => {
    if (cur.startsWith('00')) {
      const length = parseInt('0x' + cur.substring(0, 4), 16) * 2
      acc.push(`${PREFIX}${cur.substring(0, 4 + length)}`)
    }

    return acc
  }, [])

  return parseArr
}

/**
 * @description: 从 RFID 读取器上报命令中获取 EPC 和 TID
 * @param {string} command
 * @return {*}
 */
// export const getTIDByReportData = (data: string) => {
//   let str = data
//   const PREFIX = '5a00011200'
//   const TIDLengthCommandLength = 4
//   const MidCommandLength = 16

//   str = str.replace(PREFIX, '')

//   const EPCLength = parseInt('0x' + str.substring(4, 8), 16) * 2
//   const TIDLength =
//     parseInt(
//       '0x' + str.substring(8 + EPCLength + MidCommandLength, 8 + EPCLength + MidCommandLength + TIDLengthCommandLength),
//       16
//     ) * 2

//   const EPC = str.substring(8, 8 + EPCLength)
//   const TID = str.substring(
//     8 + EPCLength + MidCommandLength + TIDLengthCommandLength,
//     8 + EPCLength + MidCommandLength + TIDLengthCommandLength + TIDLength
//   )

//   return TID.toLocaleUpperCase()
// }

export const getTIDByReportData = (data: string) => {
  let str = data
  const PREFIX = '5a00011200'
  const TIDLengthCommandLength = 4
  const MidCommandLength = 16
  const EPCLengthStart = 8
  const TIDStart = 8 + MidCommandLength + TIDLengthCommandLength + EPCLengthStart

  str = str.replace(PREFIX, '')

  const EPCLength = parseInt('0x' + str.substring(4, 8), 16) * 2
  const TIDLength =
    parseInt('0x' + str.substring(EPCLengthStart + EPCLength, EPCLengthStart + EPCLength + TIDLengthCommandLength), 16) * 2

  const TID = str.substring(TIDStart, TIDStart + TIDLength)

  return TID.toLocaleUpperCase()
}

export const generateCurrentTime = () => {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

/**
 * @description: 十进制转二进制并补全 8 位，再颠倒顺序
 * @param {number} number
 * @return {*}
 */
export const convertDecimalToBinary = (number: number) => {
  const binary = number.toString(2)
  const binaryLength = binary.length
  const MAX_LENGTH = 8
  const binaryString = new Array(MAX_LENGTH - binaryLength).fill('0').join('') + binary
  const result = binaryString.split('').reverse().join('')

  return result
}

/**
 * @description: 根据数组数组生成对应索引为 1 的二进制字符串
 * @param {number} numbers
 * @return {*}
 */
// export const generateBinaryString = (numbers: number[]) => {
//   const binaryArray = new Array(32).fill('0')

//   for (const num of numbers) {
//     binaryArray[num - 1] = '1'
//   }

//   const binaryString = binaryArray.reverse().join('')
//   return binaryString
// }

export const generateBinaryString = (numbers: number[]) => {
  const binaryArray = Array.from({ length: 32 }, () => '0')

  for (const num of numbers) {
    binaryArray[num - 1] = '1'
  }

  return binaryArray.reverse().join('')
}

/**
 * @description: 二进制字符串转十六进制字符串，长度为8，补0
 * @param {string} binary
 * @return {*}
 */
export const binaryToHex = (binary: string): string => {
  const hex = parseInt(binary, 2).toString(16).toUpperCase()
  return hex.padStart(8, '0')
}

/**
 * @description: 生成锁控板命令
 * @param {string} source 锁控板命令
 * @return {*}
 */
export const generateLockCommand = (source: string) => {
  const arr = []
  for (let index = 0; index < source.length; index++) {
    if (index % 2 === 0) {
      arr.push('0x' + source.slice(index, index + 2))
    }
  }

  const result = arr.reduce((acc, cur, index) => {
    if (index === 0) acc = cur
    else {
      acc = '0x' + (acc ^ cur).toString(16)
    }

    return acc
  }, '')

  const command = [...arr, result]
    .map(item => item.slice(2, 4))
    .join('')
    .toLocaleUpperCase()

  console.log('🚀 ~ file: index.ts:170 ~ generateLockCommand ~ command', command)

  return Buffer.from(command, 'hex')
}
