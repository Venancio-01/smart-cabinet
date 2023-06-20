import { contextBridge, ipcRenderer } from "electron";
import { makeChannelName, services } from "@/services";
import "./base/loading";

function createJsBridge() {
  return services.reduce((acc, cur) => {
    acc[cur.name] = {};
    Object.keys(cur.fns).forEach((fnName) => {
      acc[cur.name][fnName] = (...args) =>
        ipcRenderer.invoke(makeChannelName(cur.name, fnName), ...args);
    });

    return acc;
  }, {});
}

const bridge = createJsBridge();
contextBridge.exposeInMainWorld("JSBridge", bridge);
