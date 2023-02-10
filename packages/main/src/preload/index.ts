import { addAlias } from 'module-alias';
addAlias('@', __dirname + '../');
import { contextBridge, ipcRenderer } from 'electron/renderer';
import { services, makeChannelName } from '../services';
import './loading';

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
console.log("🚀 ~ file: index.ts:20 ~ bridge", bridge)
contextBridge.exposeInMainWorld('JSBridge', bridge);

type Service = typeof services;
export type JSBridgeType = {
  login: Service[0]['fns'];
  lockControl: Service[1]['fns'];
  rfid: Service[2]['fns'];
  finger: Service[3]['fns'];
  sys: Service[4]['fns'];
  cabinet: Service[5]['fns'];
  document: Service[6]['fns'];
  card: Service[7]['fns'];
  network: Service[8]['fns'];
};
