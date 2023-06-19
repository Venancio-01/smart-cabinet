import { MD5 } from "crypto-js";

/**
 * @description: 生成 md5 加密后的密码
 * @param {string} username
 * @param {string} password
 * @param {string} salt
 * @return {*}
 */
export function genMd5EncryptedPassword(
  username: string,
  password: string,
  salt: string
) {
  return MD5(username + password + salt).toString();
}
