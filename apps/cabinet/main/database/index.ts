import { prisma } from "database";

// eslint-disable-next-line import/no-mutable-exports
let isConnected = false;

async function connectDatabase() {
  try {
    await prisma.$connect();
    isConnected = true;
  } catch (e) {
    console.log("数据库连接失败", e);
  }
}

export { connectDatabase, prisma, isConnected };
