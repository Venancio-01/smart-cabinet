import { getSkipAndTake } from '@smart-cabinet/utils'
import type { PaginationType } from '@smart-cabinet/utils'
import { Prisma } from '@prisma/client'
import type { DocDocument } from '.'
import { prisma } from '.'

const docDocumentArgs = Prisma.validator<Prisma.DocDocumentArgs>()({
  include: {
    alarmRecord: true,
    cabinet: true,
    cabinetDoor: true,
    department: {
      select: {
        deptName: true,
      },
    },
  },
})

export type DocDocumentProps = Prisma.DocDocumentGetPayload<typeof docDocumentArgs>

/**
 * @description: 获取载体列表
 * @param {Prisma} condition
 * @return {*}
 */
export async function selectDocDocumentList(condition?: Prisma.DocDocumentWhereInput): Promise<DocDocumentProps[]> {
  return prisma.docDocument.findMany({
    where: condition,
    ...docDocumentArgs,
  })
}

/**
 * @description: 使用分页查询载体列表
 * @param {PaginationType} pagination
 * @param {Prisma} condition
 * @return {*}
 */
export async function selectDocDocumentListWithPage(pagination: PaginationType, condition?: Prisma.DocDocumentWhereInput) {
  const skipAndTake = getSkipAndTake(pagination)

  const [data, total] = await Promise.all([
    prisma.docDocument.findMany({
      ...skipAndTake,
      where: condition,
      ...docDocumentArgs,
    }),
    prisma.docDocument.count({
      where: condition,
    }),
  ])

  return {
    data,
    total,
  }
}

/**
 * @description: 更新载体
 * @param {Partial} condition
 * @param {Partial} data
 * @return {*}
 */
export function updateDocDocument(condition: Prisma.DocDocumentWhereUniqueInput, data: Partial<DocDocument>): Promise<DocDocument> {
  return prisma.docDocument.update({
    where: condition,
    data,
  })
}
