/**
 * @description: 生成锁孔板命令
 * @param {string} source 锁控板命令
 * @return {*}
 */
export const generateCommand = (source: string) => {
  let arr = []
  for (let index = 0; index < source.length; index++) {
    if (index % 2 === 0) {
      arr.push('0x' + source.slice(index, index + 2))
    }
  }

  const result = arr.reduce((acc, cur, index) => {
    if (index === 0) acc = cur
    else {
      // @ts-ignore
      acc = '0x' + (acc ^ cur).toString(16)
    }

    return acc
  }, '')

  const command = [...arr, result]
    .map(item => item.slice(2, 4))
    .join('')
    .toLocaleUpperCase()

  return Buffer.from(command, 'hex')
}
