import { getSkipAndTake } from 'utils'
import type { PaginationType } from 'utils'
import type { DocDocument, Prisma } from '.'
import { prisma } from '.'

export async function selectDocDocumentList(): Promise<DocDocument[]>
export async function selectDocDocumentList(
  condition: Partial<PaginationType & DocDocument>,
): Promise<{ data: DocDocument[]; total: number }>
/**
 * @description: 查询载体列表
 * @param {*}
 * @return {*}
 */
export async function selectDocDocumentList(
  condition?: Partial<PaginationType & DocDocument>,
): Promise<DocDocument[] | { data: DocDocument[]; total: number }> {
  const pageCondition = getSkipAndTake(condition)

  const query: Prisma.DocDocumentWhereInput = {
    cabinetDoorId: condition?.cabinetDoorId,
    docName: {
      contains: condition?.docName,
    },
    docPStatus: condition?.docPStatus,
    deptId: condition?.deptId,
  }

  // if (condition.state === 2) {
  //   const misPlaceDocuments = await getMisPlaceCarriers()
  //   const rfids = misPlaceDocuments.map((item) => item.operationId)
  //   query.docPStatus = 1
  //   query.docRfid = { in: rfids }
  // } else if (condition.state === 1) {
  //   const misPlaceDocuments = await getMisPlaceCarriers()
  //   const rfids = misPlaceDocuments.map((item) => item.operationId)
  //   query.docPStatus = 1
  //   query.docRfid = { notIn: rfids }
  // }

  if (pageCondition) {
    const [data, total] = await Promise.all([
      prisma.docDocument.findMany({
        ...pageCondition,
        where: query,
      }),
      prisma.docDocument.count({
        where: query,
      }),
    ])

    return {
      data,
      total,
    }
  } else {
    return prisma.docDocument.findMany({
      where: query,
    })
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
