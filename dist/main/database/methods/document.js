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
const _database = /*#__PURE__*/ _interop_require_default(require(".."));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const queryDocumentCountByCabinetId = async (cabinetId = 1)=>{
    const count = await _database.default.doc_document.count({
        where: {
            cabinet_door_id: cabinetId
        }
    });
    return count;
};
const queryInPlaceDocumentCount = async (cabinetId)=>{
    const where = {
        loan_status: 0
    };
    if (cabinetId) {
        where['cabinet_door_id'] = cabinetId;
    }
    const count = await _database.default.doc_document.count({
        where
    });
    return count;
};
const queryMisplacedDocument = async (cabinetDoorID)=>{
    const result = await _database.default.rfid_switch_record.findMany({
        where: {
            operation_id: {
                not: '0'
            },
            cabinet_door_id: cabinetDoorID || undefined
        }
    });
    return result;
};
const queryMisplacedDocumentCount = async (cabinetDoorId, rfid)=>{
    const count = await _database.default.rfid_switch_record.count({
        where: {
            operation_id: rfid || undefined,
            cabinet_door_id: cabinetDoorId || undefined
        }
    });
    return count;
};
const updateDocStatusByID = async (id, state, userId)=>{
    const result = await _database.default.doc_document.updateMany({
        where: {
            doc_id: id
        },
        data: {
            operation_user_id: userId,
            loan_status: state,
            doc_last_time: new Date()
        }
    });
    return result;
};
const addMisPlacedDocument = async (document)=>{
    const result = await _database.default.rfid_switch_record.create({
        data: document
    });
    return result;
};
const updateMisPlaceDocument = async (id)=>{
    const result = await _database.default.rfid_switch_record.updateMany({
        where: {
            operation_id: id
        },
        data: {
            operation_id: '0'
        }
    });
    return result;
};
const queryMisplacedDocumentCountByOperationId = async (id)=>{
    const result = await _database.default.rfid_switch_record.findMany({
        where: {
            operation_id: id
        }
    });
    return result === null || result === void 0 ? void 0 : result.length;
};

//# sourceMappingURL=document.js.map