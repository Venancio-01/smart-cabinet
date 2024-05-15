import { ipcMain } from 'electron'
import Store from 'electron-store'
import ipcNames from '#/ipcNames'

const defaults = {
  activationCode: '',
  alarmSound: true,
}

type StoreKeys = keyof typeof defaults

const store = new Store({
  defaults,
})

export async function get(name: StoreKeys) {
  return store.get(name)
}

export function set<T>(name: StoreKeys, value: T) {
  store.set(name, value)
}

export function del(name: StoreKeys) {
  store.delete(name)
}

export function registerStoreModule() {
  ipcMain.handle(ipcNames.store.get, (_event, name: StoreKeys) => {
    return get(name)
  })

  ipcMain.on(ipcNames.store.set, (_event, name: StoreKeys, value: any) => {
    set(name, value)
  })

  ipcMain.on(ipcNames.store.delete, (_event, name: StoreKeys) => {
    del(name)
  })
}