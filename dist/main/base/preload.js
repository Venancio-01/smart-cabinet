"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _renderer = require("electron/renderer");
const _services = require("../services");
require("./loading");
function createJsBridge() {
    return _services.services.reduce((acc, cur)=>{
        acc[cur.name] = {};
        Object.keys(cur.fns).forEach((fnName)=>{
            acc[cur.name][fnName] = (...args)=>_renderer.ipcRenderer.invoke((0, _services.makeChannelName)(cur.name, fnName), ...args);
        });
        return acc;
    }, {});
}
const bridge = createJsBridge();
_renderer.contextBridge.exposeInMainWorld('JSBridge', bridge);

//# sourceMappingURL=preload.js.map