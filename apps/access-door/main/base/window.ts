import { join } from "path";
import { app, BrowserWindow, shell } from "electron";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { WINDOW_SIZE } from "@/config/window";
import { ICON_PATH } from "@/config";

let win: BrowserWindow | null = null;

// 创建窗口
export async function createWindow() {
  win = new BrowserWindow({
    ...WINDOW_SIZE,
    title: "智能载体管控系统",
    icon: ICON_PATH,
    frame: false,
    backgroundColor: "transparent",
    webPreferences: {
      preload: join(__dirname, "./preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  // 生产环境下，加载渲染进程的HTML文件
  if (app.isPackaged) {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  } else {
    win.loadURL("http://localhost:4200/");
    win.webContents.openDevTools();
    await installExtension(VUEJS_DEVTOOLS);
  }

  // 主进程主动向渲染进程推送消息
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // 所有链接都在浏览器中打开，而不是在应用程序中打开
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  return win;
}

export function sendMainProcessMessage(channel: string, ...args: any[]) {
  win?.webContents.send(channel, ...args);
}
