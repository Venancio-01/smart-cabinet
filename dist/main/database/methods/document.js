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
    queryDocumentCountByCabinetId: function() {
        return queryDocumentCountByCabinetId;
    },
    queryInPlaceDocumentCount: function() {
        return queryInPlaceDocumentCount;
    },
    queryMisplacedDocument: function() {
        return queryMisplacedDocument;
    },
    queryMisplacedDocumentCount: function() {
        return queryMisplacedDocumentCount;
    },
    updateDocStatusByID: function() {
        return updateDocStatusByID;
    },
    addMisPlacedDocument: function() {
        return addMisPlacedDocument;
    },
    updateMisPlaceDocument: function() {
        return updateMisPlaceDocument;
    },
    queryMisplacedDocumentCountByOperationId: function() {
        return queryMisplacedDocumentCountByOperationId;
    }
});
var _database = /*#__PURE__*/ _interop_require_default(require(".."));
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
function queryDocumentCountByCabinetId() {
    return _queryDocumentCountByCabinetId.apply(this, arguments);
}
function _queryDocumentCountByCabinetId() {
    _queryDocumentCountByCabinetId = _async_to_generator(function() {
        var cabinetId, count;
        var _arguments = arguments;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    cabinetId = _arguments.length > 0 && _arguments[0] !== void 0 ? _arguments[0] : 1;
                    return [
                        4,
                        _database.default.doc_document.count({
                            where: {
                                cabinet_door_id: cabinetId
                            }
                        })
                    ];
                case 1:
                    count = _state.sent();
                    return [
                        2,
                        count
                    ];
            }
        });
    });
    return _queryDocumentCountByCabinetId.apply(this, arguments);
}
function queryInPlaceDocumentCount(cabinetId) {
    return _queryInPlaceDocumentCount.apply(this, arguments);
}
function _queryInPlaceDocumentCount() {
    _queryInPlaceDocumentCount = _async_to_generator(function(cabinetId) {
        var where, count;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    where = {
                        loan_status: 0
                    };
                    if (cabinetId) where.cabinet_door_id = cabinetId;
                    return [
                        4,
                        _database.default.doc_document.count({
                            where: where
                        })
                    ];
                case 1:
                    count = _state.sent();
                    return [
                        2,
                        count
                    ];
            }
        });
    });
    return _queryInPlaceDocumentCount.apply(this, arguments);
}
function queryMisplacedDocument(cabinetDoorID) {
    return _queryMisplacedDocument.apply(this, arguments);
}
function _queryMisplacedDocument() {
    _queryMisplacedDocument = _async_to_generator(function(cabinetDoorID) {
        var result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _database.default.rfid_switch_record.findMany({
                            where: {
                                operation_id: {
                                    not: "0"
                                },
                                cabinet_door_id: cabinetDoorID || undefined
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
    return _queryMisplacedDocument.apply(this, arguments);
}
function queryMisplacedDocumentCount(cabinetDoorId, rfid) {
    return _queryMisplacedDocumentCount.apply(this, arguments);
}
function _queryMisplacedDocumentCount() {
    _queryMisplacedDocumentCount = _async_to_generator(function(cabinetDoorId, rfid) {
        var count;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _database.default.rfid_switch_record.count({
                            where: {
                                operation_id: rfid || undefined,
                                cabinet_door_id: cabinetDoorId || undefined
                            }
                        })
                    ];
                case 1:
                    count = _state.sent();
                    return [
                        2,
                        count
                    ];
            }
        });
    });
    return _queryMisplacedDocumentCount.apply(this, arguments);
}
function updateDocStatusByID(id, state, userId) {
    return _updateDocStatusByID.apply(this, arguments);
}
function _updateDocStatusByID() {
    _updateDocStatusByID = _async_to_generator(function(id, state, userId) {
        var result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _database.default.doc_document.updateMany({
                            where: {
                                doc_id: id
                            },
                            data: {
                                operation_user_id: userId,
                                loan_status: state,
                                doc_last_time: new Date()
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
    return _updateDocStatusByID.apply(this, arguments);
}
function addMisPlacedDocument(document) {
    return _addMisPlacedDocument.apply(this, arguments);
}
function _addMisPlacedDocument() {
    _addMisPlacedDocument = _async_to_generator(function(document) {
        var result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _database.default.rfid_switch_record.create({
                            data: document
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
    return _addMisPlacedDocument.apply(this, arguments);
}
function updateMisPlaceDocument(id) {
    return _updateMisPlaceDocument.apply(this, arguments);
}
function _updateMisPlaceDocument() {
    _updateMisPlaceDocument = _async_to_generator(function(id) {
        var result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _database.default.rfid_switch_record.updateMany({
                            where: {
                                operation_id: id
                            },
                            data: {
                                operation_id: "0"
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
    return _updateMisPlaceDocument.apply(this, arguments);
}
function queryMisplacedDocumentCountByOperationId(id) {
    return _queryMisplacedDocumentCountByOperationId.apply(this, arguments);
}
function _queryMisplacedDocumentCountByOperationId() {
    _queryMisplacedDocumentCountByOperationId = _async_to_generator(function(id) {
        var result;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        _database.default.rfid_switch_record.findMany({
                            where: {
                                operation_id: id
                            }
                        })
                    ];
                case 1:
                    result = _state.sent();
                    return [
                        2,
                        result === null || result === void 0 ? void 0 : result.length
                    ];
            }
        });
    });
    return _queryMisplacedDocumentCountByOperationId.apply(this, arguments);
}

//# sourceMappingURL=document.js.map