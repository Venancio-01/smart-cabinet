import { ipcMain } from 'electron'
import Store from 'electron-store'

const defaults = {
  activationCode: '',
}

type StoreKeys = keyof typeof defaults

const store = new Store({
  defaults,
})

async function get(name: StoreKeys) {
  return store.get(name)
}

function set<T>(name: StoreKeys, value: T) {
  store.set(name, value)
}

function del(name: StoreKeys) {
  store.delete(name)
}

export function registerStoreModule() {
  ipcMain.handle('store:get', (_event, name: StoreKeys) => {
    return get(name)
  })

  ipcMain.on('store:set', (_event, name: StoreKeys, value: any) => {
    set(name, value)
  })

  ipcMain.on('store:delete', (_event, name: StoreKeys) => {
    del(name)
  })
}
