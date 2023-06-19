import { PrismaClient, getEvnFilePath } from "database";
import dotenv from "dotenv";

const isDev = import.meta.env.DEV;

// 加载数据库地址环境变量
dotenv.config({
  path: getEvnFilePath(isDev),
});

const prisma = new PrismaClient();
// eslint-disable-next-line import/no-mutable-exports
let isConnected = false;

prisma
  .$connect()
  .then(() => {
    isConnected = true;
  })
  .catch(() => {
    isConnected = false;
  });

export { prisma, isConnected };
