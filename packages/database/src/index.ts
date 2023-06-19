import { resolve } from "path";

export * from "@prisma/client";

export function getEvnFilePath(isDev: boolean) {
  return isDev
    ? resolve(__dirname, "../../../../packages/database/.env")
    : resolve(process.resourcesPath, ".env");
}
