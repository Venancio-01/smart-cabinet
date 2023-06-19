import { machineId } from "node-machine-id";
import CryptoJS from "crypto-js";

const key = "liqingshan_hjrich";

/**
 * 获取机器ID
 * @returns Promise<string>
 */
async function getDeskId(): Promise<string> {
  const id = await machineId();
  return id;
}

/**
 * 加密
 * @param data 待加密数据
 * @returns string
 */
function encrypt(data: string): string {
  const encrypted = CryptoJS.HmacMD5(data, key).toString();
  return encrypted;
}

/**
 * 加密服务
 */
const encryptionService = {
  name: "encryption" as const,
  fns: {
    getDeskId,
    encrypt,
  },
};

export default encryptionService;
