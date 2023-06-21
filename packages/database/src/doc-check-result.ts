import type { DocCheckResult } from '.'
import { prisma } from '.'

/**
 * @description: 新增载体盘点结果
 * @param {Partial} docCheckResultList
 * @return {*}
 */
export function insertCheckResult(docCheckResultList: Partial<DocCheckResult>[]) {
  return prisma.docCheckResult.createMany({
    data: docCheckResultList,
  })
}
