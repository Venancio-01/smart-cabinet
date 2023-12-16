import dayjs from 'dayjs'

/**
 * @description: 生成当前时间
 * @return {*}
 */
export function generateCurrentTime() {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}
