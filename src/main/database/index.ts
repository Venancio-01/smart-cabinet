import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;
let connected = false;

async function connectToDatabase() {
  try {
    prisma = new PrismaClient();
    await prisma.$connect();
    connected = true;
  } catch (e) {
    console.log(e, "数据库连接失败");
    connected = false;
  }
}

async function disconnectFromDatabase() {
  if (prisma && connected) {
    await prisma.$disconnect();
    prisma = null;
    connected = false;
  }
}

connectToDatabase();

export { connectToDatabase, disconnectFromDatabase, prisma, connected };
