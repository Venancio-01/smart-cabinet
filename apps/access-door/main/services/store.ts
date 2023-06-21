import Store from 'electron-store'

const defaults = {
  activationCode: '',
}

type StoreKeys = keyof typeof defaults

const store = new Store({
  defaults,
})

/**
 * Get a value from the store
 * @param name - The name of the value to get
 * @returns The value from the store
 */
async function get(name: StoreKeys) {
  return store.get(name)
}

/**
 * Set a value in the store
 * @param name - The name of the value to set
 * @param value - The value to set
 */
function set<T>(name: StoreKeys, value: T) {
  store.set(name, value)
}

/**
 * Delete a value from the store
 * @param name - The name of the value to delete
 */
function del(name: StoreKeys) {
  store.delete(name)
}

const storeService = {
  name: 'store' as const,
  fns: {
    get,
    set,
    delete: del,
  },
}

export default storeService
