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
const _database = require("../database");
const getConnectState = ()=>{
    return _database.connected;
};
const networkService = {
    name: 'network',
    fns: {
        getConnectState
    }
};
const _default = networkService;

//# sourceMappingURL=network-status.js.map