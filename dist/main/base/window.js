"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createWindow", {
    enumerable: true,
    get: function() {
        return createWindow;
    }
});
const _electron = require("electron");
const _path = require("path");
const _config = require("../config");
const preload = (0, _path.join)(__dirname, './preload.js');
const url = 'http://localhost:4200/';
const indexHtml = (0, _path.join)(__dirname, '../../dist/index.html');
const createWindow = async ()=>{
    const win = new _electron.BrowserWindow({
        ..._config.WINDOW_SIZE,
        title: '智能载体管控系统',
        // icon: join(process.env.PUBLIC, 'favicon.ico'),
        frame: false,
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: true
        }
    });
    if (_electron.app.isPackaged) {
        win.loadFile(indexHtml);
    } else {
        win.loadURL(url);
        _electron.session.defaultSession.loadExtension(_config.DEVTOOLS_PATH);
        win.webContents.openDevTools();
    }
    // Test actively push message to the Electron-Renderer
    win.webContents.on('did-finish-load', ()=>{
        win === null || win === void 0 ? void 0 : win.webContents.send('main-process-message', new Date().toLocaleString());
    });
    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url  })=>{
        if (url.startsWith('https:')) _electron.shell.openExternal(url);
        return {
            action: 'deny'
        };
    });
    return win;
};

//# sourceMappingURL=window.js.map