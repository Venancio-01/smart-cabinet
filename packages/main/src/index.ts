// const { addAlias } = require('module-alias')
// addAlias('@', __dirname + '../../')
import { app, BrowserWindow, shell, globalShortcut } from 'electron';
import { join } from 'path';
import { WINDOW_SIZE } from '@/config/window';
import { services, makeChannelName } from '@/services';
import { ipcMain } from 'electron';

const url = 'http://127.0.0.1:3000/';
const indexHtml = join(__dirname, '../../dist/index.html');

// Disable GPU Acceleration for Linux.
app.disableHardwareAcceleration();

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
const preload = join(__dirname, '../preload/index.js');

async function createWindow() {
  win = new BrowserWindow({
    ...WINDOW_SIZE,
    title: 'Main window',
    // icon: join(process.env.PUBLIC, 'favicon.ico'),
    frame: false,
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (app.isPackaged) {
    win.loadFile(indexHtml);
  } else {
    win.loadURL(url);
    win.webContents.openDevTools();
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });
}

const disableShortcuts = () => {
  // 禁用 Control+Shift+I 打开开发者面板
  // 禁用 Control+R 刷新页面
  // 禁用 F11 全屏
  globalShortcut.registerAll(
    ['CommandOrControl+Shift+I', 'CommandOrControl+R', 'F11'],
    () => {
      return false;
    }
  );
};

const installService = () => {
  services.forEach((service) => {
    Object.entries(service.fns).forEach(([apiName, apiFn]) => {
      ipcMain.handle(makeChannelName(service.name, apiName), (ev, ...args) =>
        apiFn(...args)
      );
    });
  });
};

app.whenReady().then(async () => {
  await createWindow();
  installService();
  if (app.isPackaged) {
    disableShortcuts();
  }
});

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
