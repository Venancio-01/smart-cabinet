"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _electronstore = /*#__PURE__*/ _interop_require_default(require("electron-store"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const defaults = {
    activationCode: ''
};
const store = new _electronstore.default({
    defaults
});
/**
 * Get a value from the store
 * @param name - The name of the value to get
 * @returns The value from the store
 */ const get = async (name)=>{
    return store.get(name);
};
/**
 * Set a value in the store
 * @param name - The name of the value to set
 * @param value - The value to set
 */ const set = (name, value)=>{
    store.set(name, value);
};
/**
 * Delete a value from the store
 * @param name - The name of the value to delete
 */ const del = (name)=>{
    store.delete(name);
};
const storeService = {
    name: 'store',
    fns: {
        get,
        set,
        delete: del
    }
};
const _default = storeService;

//# sourceMappingURL=store-service.js.map