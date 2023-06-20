import os from "os";
import dayjs from "dayjs";
import { BrowserWindow, globalShortcut } from "electron";
import type { PaginationType } from "../types";

/**
 * @description: 生成 ipc 通信的返回数据结构
 * @param {*} T
 * @return {*}
 */
export function genResponseData<T>(success: boolean, msg?: string, data?: T) {
  return {
    success,
    msg,
    data,
  };
}

/**
 * @description: 生成当前时间
 * @return {*}
 */
export function generateCurrentTime() {
  return dayjs().format("YYYY-MM-DD HH:mm:ss");
}

/**
 * @description: 发送 ipc 通信到渲染进程
 * @param {string} channel
 * @param {array} args
 * @return {*}
 */
export function sendIpcToRenderer(channel: string, ...args: any[]) {
  BrowserWindow.getAllWindows().forEach((wnd) => {
    if (wnd.webContents && !wnd.webContents.isDestroyed())
      wnd.webContents.send(channel, ...args);
  });
}

/**
 * @description: 获取分页的 skip 和 take
 * @param {Partial} condition
 * @return {*}
 */
export function getSkipAndTake(condition?: Partial<PaginationType>): {
  skip?: number;
  take?: number;
} {
  if (!condition || !condition.page || !condition.size) return {};

  const { page, size } = condition;
  return { skip: (page - 1) * size, take: size };
}

/**
 * @description: 禁用快捷键
 * @return {*}
 */
export function disableShortcuts() {
  globalShortcut.registerAll(["CommandOrControl+R", "F11"], () => {
    return false;
  });
}

// 获取本机 ip 地址
export function getLocalIpAddress(): string[] {
  const interfaces = os.networkInterfaces();
  const addresses: string[] = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] ?? []) {
      if (iface.family === "IPv4" && !iface.internal)
        addresses.push(iface.address);
    }
  }
  return addresses;
}
