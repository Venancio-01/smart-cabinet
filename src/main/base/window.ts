import { join } from "path";
import { BrowserWindow, app, session, shell } from "electron";
import { DEVTOOLS_PATH, WINDOW_SIZE } from "@/config";

const preload = join(__dirname, "./preload.js");
const url = "http://localhost:4200/";
const indexHtml = join(__dirname, "../../renderer/index.html");

export async function createWindow() {
  const win = new BrowserWindow({
    ...WINDOW_SIZE,
    title: "智能载体管控系统",
    // icon: join(process.env.PUBLIC, 'favicon.ico'),
    frame: false,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  if (app.isPackaged) {
    win.loadFile(indexHtml);
  } else {
    win.loadURL(url);
    session.defaultSession.loadExtension(DEVTOOLS_PATH);
    win.webContents.openDevTools();
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  return win;
}
