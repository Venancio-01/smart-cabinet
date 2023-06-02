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
var _rfidservice = require("./rfid-service");
var _document = require("../database/methods/document");
var _database = /*#__PURE__*/ _interop_require_default(require("../database"));
var _utils = require("../utils");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
function getAllCarrierData() {
    return _getAllCarrierData.apply(this, arguments);
}
function _getAllCarrierData() {
    _getAllCarrierData = _async_to_generator(function() {
        var result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _database.default.doc_document.findMany()
                    ];
                case 1:
                    result = _state.sent();
                    return [
                        2,
                        result
                    ];
            }
        });
    });
    return _getAllCarrierData.apply(this, arguments);
}
function getCarrierDataByCondition(condition) {
    return _getCarrierDataByCondition.apply(this, arguments);
}
function _getCarrierDataByCondition() {
    _getCarrierDataByCondition = _async_to_generator(function(condition) {
        var _condition_state, where, misPlaceDocuments, rfids, misPlaceDocuments1, rfids1, result, count;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    where = {
                        cabinet_door_id: condition.cabinetId ? Number(condition.cabinetId) : undefined,
                        doc_name: {
                            contains: condition.title
                        },
                        loan_status: (_condition_state = condition.state) !== null && _condition_state !== void 0 ? _condition_state : undefined,
                        binding_dept_id: condition.departmentId ? Number(condition.departmentId) : undefined
                    };
                    if (!(condition.state === 2)) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        (0, _document.queryMisplacedDocument)()
                    ];
                case 1:
                    misPlaceDocuments = _state.sent();
                    rfids = misPlaceDocuments.map(function(item) {
                        return item.operation_id;
                    });
                    where.loan_status = 1;
                    where.doc_rfid = {
                        in: rfids
                    };
                    return [
                        3,
                        4
                    ];
                case 2:
                    if (!(condition.state === 1)) return [
                        3,
                        4
                    ];
                    return [
                        4,
                        (0, _document.queryMisplacedDocument)()
                    ];
                case 3:
                    misPlaceDocuments1 = _state.sent();
                    rfids1 = misPlaceDocuments1.map(function(item) {
                        return item.operation_id;
                    });
                    where.loan_status = 1;
                    where.doc_rfid = {
                        notIn: rfids1
                    };
                    _state.label = 4;
                case 4:
                    return [
                        4,
                        _database.default.doc_document.findMany({
                            skip: (condition.page - 1) * condition.size,
                            take: condition.size,
                            where: where
                        })
                    ];
                case 5:
                    result = _state.sent();
                    return [
                        4,
                        _database.default.doc_document.count({
                            where: where
                        })
                    ];
                case 6:
                    count = _state.sent();
                    return [
                        2,
                        {
                            data: result,
                            total: count
                        }
                    ];
            }
        });
    });
    return _getCarrierDataByCondition.apply(this, arguments);
}
function getCarrierDataByCabinetId(cabinetId) {
    return _getCarrierDataByCabinetId.apply(this, arguments);
}
function _getCarrierDataByCabinetId() {
    _getCarrierDataByCabinetId = _async_to_generator(function(cabinetId) {
        var result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _database.default.doc_document.findMany({
                            where: {
                                cabinet_door_id: cabinetId
                            }
                        })
                    ];
                case 1:
                    result = _state.sent();
                    return [
                        2,
                        result
                    ];
            }
        });
    });
    return _getCarrierDataByCabinetId.apply(this, arguments);
}
function getInPlaceCarrierCount(cabinetId) {
    return _getInPlaceCarrierCount.apply(this, arguments);
}
function _getInPlaceCarrierCount() {
    _getInPlaceCarrierCount = _async_to_generator(function(cabinetId) {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        (0, _document.queryInPlaceDocumentCount)(cabinetId)
                    ];
                case 1:
                    return [
                        2,
                        _state.sent()
                    ];
            }
        });
    });
    return _getInPlaceCarrierCount.apply(this, arguments);
}
function getMisPlaceCarriers() {
    return _getMisPlaceCarriers.apply(this, arguments);
}
function _getMisPlaceCarriers() {
    _getMisPlaceCarriers = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        (0, _document.queryMisplacedDocument)()
                    ];
                case 1:
                    return [
                        2,
                        _state.sent()
                    ];
            }
        });
    });
    return _getMisPlaceCarriers.apply(this, arguments);
}
function updateCarrier(cabinetDoor, userId) {
    return _updateCarrier.apply(this, arguments);
}
function _updateCarrier() {
    _updateCarrier = _async_to_generator(function(cabinetDoor, userId) {
        var TIDList, documents, i, doc, isWarningDocument, data, isDocumentDetected, misPlaceDocuments, i1, doc1;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    TIDList = (0, _rfidservice.getReportData)(cabinetDoor.antenna_address);
                    console.log(cabinetDoor.id, "柜门id");
                    console.log("\uD83D\uDE80 ~ file: document-service.ts:94 ~ updateCarrier ~ TIDList:", TIDList);
                    console.log("\uD83D\uDE80 ~ file: document-service.ts:94 ~ updateCarrier ~ TIDList.length:", TIDList.length);
                    return [
                        4,
                        getAllCarrierData()
                    ];
                case 1:
                    documents = _state.sent();
                    i = 0;
                    _state.label = 2;
                case 2:
                    if (!(i < documents.length)) return [
                        3,
                        10
                    ];
                    doc = documents[i];
                    if (!(doc.cabinet_door_id !== cabinetDoor.id)) return [
                        3,
                        5
                    ];
                    return [
                        4,
                        (0, _document.queryMisplacedDocumentCount)(cabinetDoor.id, doc.doc_rfid)
                    ];
                case 3:
                    isWarningDocument = _state.sent() !== 0;
                    if (isWarningDocument) return [
                        3,
                        9
                    ];
                    data = {
                        cabinet_door_id: cabinetDoor.id,
                        cabinet_id: cabinetDoor.cabinet_id,
                        content: "文件[".concat(doc.doc_name, "]错放"),
                        datetime: (0, _utils.generateCurrentTime)(),
                        operation_id: TIDList.includes(doc.doc_rfid) ? doc.doc_rfid : "0",
                        type: "1",
                        user_id: userId || null
                    };
                    return [
                        4,
                        (0, _document.addMisPlacedDocument)(data)
                    ];
                case 4:
                    _state.sent();
                    return [
                        3,
                        9
                    ];
                case 5:
                    isDocumentDetected = TIDList.includes(doc.doc_rfid);
                    if (!(isDocumentDetected && doc.loan_status === 1)) return [
                        3,
                        7
                    ];
                    return [
                        4,
                        (0, _document.updateDocStatusByID)(doc.doc_id, 0, userId)
                    ];
                case 6:
                    _state.sent();
                    return [
                        3,
                        9
                    ];
                case 7:
                    if (!(!isDocumentDetected && doc.loan_status === 0)) return [
                        3,
                        9
                    ];
                    return [
                        4,
                        (0, _document.updateDocStatusByID)(doc.doc_id, 1, userId)
                    ];
                case 8:
                    _state.sent();
                    _state.label = 9;
                case 9:
                    i++;
                    return [
                        3,
                        2
                    ];
                case 10:
                    return [
                        4,
                        getMisPlaceCarriers()
                    ];
                case 11:
                    misPlaceDocuments = _state.sent();
                    i1 = 0;
                    _state.label = 12;
                case 12:
                    if (!(i1 < misPlaceDocuments.length)) return [
                        3,
                        15
                    ];
                    doc1 = misPlaceDocuments[i1];
                    if (!!TIDList.includes(doc1.operation_id)) return [
                        3,
                        14
                    ];
                    return [
                        4,
                        (0, _document.updateMisPlaceDocument)(doc1.operation_id)
                    ];
                case 13:
                    _state.sent();
                    _state.label = 14;
                case 14:
                    i1++;
                    return [
                        3,
                        12
                    ];
                case 15:
                    return [
                        2
                    ];
            }
        });
    });
    return _updateCarrier.apply(this, arguments);
}
var carrierService = {
    name: "carrier",
    fns: {
        getAllCarrierData: getAllCarrierData,
        getCarrierDataByCondition: getCarrierDataByCondition,
        getCarrierDataByCabinetId: getCarrierDataByCabinetId,
        getInPlaceCarrierCount: getInPlaceCarrierCount,
        getMisPlaceCarriers: getMisPlaceCarriers,
        updateCarrier: updateCarrier
    }
};
var _default = carrierService;

//# sourceMappingURL=carrier-service.js.map