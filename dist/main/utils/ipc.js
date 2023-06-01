"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sendIpcToRenderer", {
    enumerable: true,
    get: function() {
        return sendIpcToRenderer;
    }
});
const _electron = require("electron");
function sendIpcToRenderer(channel, ...args) {
    _electron.BrowserWindow.getAllWindows().forEach((wnd)=>{
        if (wnd.webContents && !wnd.webContents.isDestroyed()) wnd.webContents.send(channel, ...args);
    });
}

//# sourceMappingURL=ipc.js.map