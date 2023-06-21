import { join } from 'path'
import { BrowserWindow, app, session, shell } from 'electron'
import { DEVTOOLS_PATH, WINDOW_SIZE } from 'utils/config/main'

export async function createWindow() {
  const win = new BrowserWindow({
    ...WINDOW_SIZE,
    title: '智能载体管控系统',
    // icon: join(process.env.PUBLIC, 'favicon.ico'),
    frame: false,
    backgroundColor: 'transparent',
    webPreferences: {
      preload: join(__dirname, './preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    },
  })

  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    win.loadURL('http://localhost:4200/')
    session.defaultSession.loadExtension(DEVTOOLS_PATH)
    win.webContents.openDevTools()
  }

  // 主进程主动向渲染进程推送消息
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // 所有链接都在浏览器中打开，而不是在应用程序中打开
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  return win
}
