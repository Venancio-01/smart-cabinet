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
var _database = require("../database");
function getConnectState() {
    return _database.connected;
}
var networkService = {
    name: "network",
    fns: {
        getConnectState: getConnectState
    }
};
var _default = networkService;

//# sourceMappingURL=network-status.js.map