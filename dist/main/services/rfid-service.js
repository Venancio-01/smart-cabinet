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
    getReportData: function() {
        return getReportData;
    },
    default: function() {
        return _default;
    }
});
const _utils = require("../utils");
const _socket = /*#__PURE__*/ _interop_require_default(require("../utils/socket"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const instanceMap = {};
const generateAntennaCommand = (antennaIds)=>{
    const binary = (0, _utils.generateBinaryString)(antennaIds);
    const command = (0, _utils.binaryToHex)(binary);
    return command;
};
const init = async (address, port)=>{
    if (instanceMap[address]) return true;
    instanceMap[address] = new _socket.default({
        address,
        port
    });
    try {
        await instanceMap[address].init();
        return true;
    } catch (e) {
        console.log(e, 'rfid socket 连接失败');
        return false;
    }
};
const destroy = (address)=>{
    if (!instanceMap[address]) return;
    instanceMap[address].destroy();
    instanceMap[address] = null;
};
const sendCloseCommand = (address)=>{
    if (!instanceMap[address]) return;
    instanceMap[address].write(Buffer.from('5A000102FF0000885A', 'hex'));
};
const sendOpenCommand = (address, antennaIds)=>{
    if (!instanceMap[address]) return;
    const COMMAND_HEADER = '5A';
    const commandBody = `000102100008${generateAntennaCommand(antennaIds)}01020006`;
    const checkCode = (0, _utils.generateCRC16Code)(commandBody);
    const command = COMMAND_HEADER + commandBody + checkCode;
    instanceMap[address].write(Buffer.from(command, 'hex'));
};
const getReportData = (address)=>{
    if (!instanceMap[address]) {
        console.log('socket 连接不存在');
        return [];
    }
    const data = instanceMap[address].getData();
    const reportData = (0, _utils.parseRFIDReportData)(data);
    const TIDList = [
        ...new Set(reportData.map((item)=>(0, _utils.getTIDByReportData)(item)))
    ];
    return TIDList;
};
const rfidService = {
    name: 'rfid',
    fns: {
        init,
        destroy,
        sendCloseCommand,
        sendOpenCommand,
        getReportData
    }
};
const _default = rfidService;

//# sourceMappingURL=rfid-service.js.map