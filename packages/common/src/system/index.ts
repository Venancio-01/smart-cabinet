import { join } from 'path'

/**
 * @description: 获取生产环境的背景图路径
 * @return {*}
 */
export function getProductionBgImagePath() {
  return join(process.resourcesPath, '/public/background/index.png')
}
