import { resolve } from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @description: 获取环境变量文件路径
 * @param {boolean} isDev
 * @return {*}
 */
export function getEvnFilePath(isDev: boolean) {
  return isDev
    ? resolve(__dirname, "../../../env/.env")
    : resolve(process.resourcesPath, ".env");
}

export { prisma };
export * from "@prisma/client";
export * from "./check-log";
