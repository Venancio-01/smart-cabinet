"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: function() {
        return _default;
    },
    connected: function() {
        return connected;
    }
});
const _client = require("@prisma/client");
let prisma = null;
let connected = false;
try {
    prisma = new _client.PrismaClient();
    connected = true;
} catch (e) {
    console.log(e, '数据库连接失败');
    connected = false;
}
const _default = prisma;

//# sourceMappingURL=index.js.map