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
    handleExitUpdateService: function() {
        return handleExitUpdateService;
    },
    default: function() {
        return _default;
    }
});
const _socket = /*#__PURE__*/ _interop_require_default(require("../utils/socket"));
const _config = require("../config");
const _utils = require("../utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let instance = null;
let isConnected = false;
const handleExitUpdateService = ()=>{
    if (!isConnected) return;
    const message = {
        type: 'exit'
    };
    handleSendData(message);
};
const handleSendData = (data)=>{
    const stringifyData = JSON.stringify(data);
    instance.write(stringifyData);
};
const handleReceiveData = ()=>{
    if (!isConnected) return;
    const data = instance.getData();
    if (data === '') return null;
    instance.setData('');
    try {
        const parseData = JSON.parse(data);
        return parseData;
    } catch (e) {
        console.log(e);
        return null;
    }
};
const handleSendCheckVersionMessage = ()=>{
    if (!isConnected) return;
    const data = {
        type: 'version',
        content: (0, _utils.getAppVersion)(),
        path: 'https://service.qingshan.ltd/version.json'
    };
    handleSendData(data);
};
const handleSendDownloadMessage = ()=>{
    if (!isConnected) return;
    const data = {
        type: 'download'
    };
    handleSendData(data);
};
const updateService = {
    name: 'update',
    fns: {
        init: async ()=>{
            instance = new _socket.default({
                address: _config.UPDATE_SERVICE_SOCKET_PATH,
                format: 'utf-8'
            });
            try {
                await instance.init();
                return isConnected = true;
            } catch (e) {
                console.log(e, 'update service socket 连接失败');
                return isConnected;
            }
        },
        handleReceiveData,
        handleSendCheckVersionMessage,
        handleSendDownloadMessage,
        handleExitUpdateService
    }
};
const _default = updateService;

//# sourceMappingURL=update-service.js.map