import type { DocCheckLog } from ".";
import { prisma } from ".";

/**
 * @description: 新增载体盘点
 * @param {DocCheckLog} docCheckLog 载体盘点信息
 * @return {*}
 */
export function insertDocCheckLog(docCheckLog: Partial<DocCheckLog>) {
  return prisma.docCheckLog.create({
    data: docCheckLog,
  });
}
