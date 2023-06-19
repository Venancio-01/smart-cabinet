import { ipcMain } from "electron";
import lockControlService from "./lock-control";
import rfidService from "./rfid";
import fingerService from "./finger";
import sysService from "./system";
import cabinetService from "./cabinet";
import carrierService from "./carrier";
import networkService from "./network";
import updateService from "./update";
import storeService from "./store";
import encryptionService from "./encryption";
import logService from "./logger";

export const services = [
  lockControlService,
  rfidService,
  fingerService,
  sysService,
  cabinetService,
  carrierService,
  networkService,
  updateService,
  storeService,
  encryptionService,
  logService,
];

export type ServiceType = typeof services;

export function makeChannelName(name, fnName) {
  return `${name}.${fnName}`;
}

/**
 * @description: 注册服务
 * @return {*}
 */
export function installService() {
  services.forEach((service) => {
    Object.entries(service.fns).forEach(([apiName, apiFn]) => {
      ipcMain.handle(makeChannelName(service.name, apiName), (ev, ...args) =>
        apiFn(...args)
      );
    });
  });
}
