import { join } from 'path'
import process from 'process'

/**
 * @description: 获取生产环境的背景图路径
 * @return {*}
 */
export function getProductionBgImagePath() {
  return join(process.resourcesPath, '/public/background/index.png')
}
