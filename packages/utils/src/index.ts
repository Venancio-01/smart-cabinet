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

export function generateCurrentTime() {
  return dayjs().format("YYYY-MM-DD HH:mm:ss");
}

export function sendIpcToRenderer(channel: string, ...args: any[]) {
  BrowserWindow.getAllWindows().forEach((wnd) => {
    if (wnd.webContents && !wnd.webContents.isDestroyed())
      wnd.webContents.send(channel, ...args);
  });
}

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
  // 禁用 Control+Shift+I 打开开发者面板
  // 禁用 Control+R 刷新页面
  // 禁用 F11 全屏
  // ['CommandOrControl+Shift+I', 'CommandOrControl+R', 'F11']
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
