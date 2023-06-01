"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _electron = require("electron");
const _services = require("./services/index");
const _window = require("./base/window");
const _updateservice = require("./services/update-service");
const _config = require("./config/index");
const _dotenv = /*#__PURE__*/ _interop_require_default(require("dotenv"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// 加载环境变量
_dotenv.default.config({
    path: _config.EVN_FILE_PATH
});
// Disable GPU Acceleration for Linux.
_electron.app.disableHardwareAcceleration();
if (!_electron.app.requestSingleInstanceLock()) {
    _electron.app.quit();
    process.exit(0);
}
// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
let win = null;
/**
 * @description: 禁用快捷键
 * @return {*}
 */ const disableShortcuts = ()=>{
    // 禁用 Control+Shift+I 打开开发者面板
    // 禁用 Control+R 刷新页面
    // 禁用 F11 全屏
    // ['CommandOrControl+Shift+I', 'CommandOrControl+R', 'F11']
    _electron.globalShortcut.registerAll([
        'CommandOrControl+R',
        'F11'
    ], ()=>{
        return false;
    });
};
/**
 * @description: 注册服务
 * @return {*}
 */ const installService = ()=>{
    _services.services.forEach((service)=>{
        Object.entries(service.fns).forEach(([apiName, apiFn])=>{
            _electron.ipcMain.handle((0, _services.makeChannelName)(service.name, apiName), (ev, ...args)=>apiFn(...args));
        });
    });
};
_electron.app.whenReady().then(async ()=>{
    win = await (0, _window.createWindow)();
    installService();
    if (_electron.app.isPackaged) {
        disableShortcuts();
    }
});
_electron.app.on('window-all-closed', ()=>{
    win = null;
    if (process.platform !== 'darwin') {
        _electron.app.quit();
    }
});
_electron.app.on('second-instance', ()=>{
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore();
        win.focus();
    }
});
_electron.app.on('activate', ()=>{
    const allWindows = _electron.BrowserWindow.getAllWindows();
    if (allWindows.length) {
        allWindows[0].focus();
    } else {
        (0, _window.createWindow)();
    }
});
_electron.app.on('before-quit', ()=>{
    _updateservice.handleExitUpdateService;
});

//# sourceMappingURL=index.js.map