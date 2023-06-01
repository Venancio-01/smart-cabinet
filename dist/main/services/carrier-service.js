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
const _document = require("../database/methods/document");
const _database = /*#__PURE__*/ _interop_require_default(require("../database"));
const _utils = require("../utils");
const _rfidservice = require("./rfid-service");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const getAllCarrierData = async ()=>{
    const result = await _database.default.doc_document.findMany();
    return result;
};
const getCarrierDataByCondition = async (condition)=>{
    var _condition_state;
    const where = {
        cabinet_door_id: condition.cabinetId ? Number(condition.cabinetId) : undefined,
        doc_name: {
            contains: condition.title
        },
        loan_status: (_condition_state = condition.state) !== null && _condition_state !== void 0 ? _condition_state : undefined,
        binding_dept_id: condition.departmentId ? Number(condition.departmentId) : undefined
    };
    if (condition.state === 2) {
        const misPlaceDocuments = await (0, _document.queryMisplacedDocument)();
        const rfids = misPlaceDocuments.map((item)=>item.operation_id);
        where.loan_status = 1;
        where['doc_rfid'] = {
            in: rfids
        };
    } else if (condition.state === 1) {
        const misPlaceDocuments = await (0, _document.queryMisplacedDocument)();
        const rfids = misPlaceDocuments.map((item)=>item.operation_id);
        where.loan_status = 1;
        where['doc_rfid'] = {
            notIn: rfids
        };
    }
    const result = await _database.default.doc_document.findMany({
        skip: (condition.page - 1) * condition.size,
        take: condition.size,
        where
    });
    const count = await _database.default.doc_document.count({
        where
    });
    return {
        data: result,
        total: count
    };
};
const getCarrierDataByCabinetId = async (cabinetId)=>{
    const result = await _database.default.doc_document.findMany({
        where: {
            cabinet_door_id: cabinetId
        }
    });
    return result;
};
const getInPlaceCarrierCount = async (cabinetId)=>{
    return await (0, _document.queryInPlaceDocumentCount)(cabinetId);
};
const getMisPlaceCarriers = async ()=>{
    return await (0, _document.queryMisplacedDocument)();
};
const updateCarrier = async (cabinetDoor, userId)=>{
    const TIDList = (0, _rfidservice.getReportData)(cabinetDoor.antenna_address);
    console.log(cabinetDoor.id, '柜门id');
    console.log('🚀 ~ file: document-service.ts:94 ~ updateCarrier ~ TIDList:', TIDList);
    console.log('🚀 ~ file: document-service.ts:94 ~ updateCarrier ~ TIDList.length:', TIDList.length);
    const documents = await getAllCarrierData();
    for(let i = 0; i < documents.length; i++){
        const doc = documents[i];
        // 如果不是本柜门文件
        if (doc.cabinet_door_id !== cabinetDoor.id) {
            const isWarningDocument = await (0, _document.queryMisplacedDocumentCount)(cabinetDoor.id, doc.doc_rfid) !== 0;
            if (isWarningDocument) continue;
            const data = {
                cabinet_door_id: cabinetDoor.id,
                cabinet_id: cabinetDoor.cabinet_id,
                content: `文件[${doc.doc_name}]错放`,
                datetime: (0, _utils.generateCurrentTime)(),
                operation_id: TIDList.includes(doc.doc_rfid) ? doc.doc_rfid : '0',
                type: '1',
                user_id: userId || null
            };
            await (0, _document.addMisPlacedDocument)(data);
        } else {
            const isDocumentDetected = TIDList.includes(doc.doc_rfid);
            // 归还
            if (isDocumentDetected && doc.loan_status === 1) {
                await (0, _document.updateDocStatusByID)(doc.doc_id, 0, userId);
            } else if (!isDocumentDetected && doc.loan_status === 0) {
                await (0, _document.updateDocStatusByID)(doc.doc_id, 1, userId);
            }
        }
    }
    const misPlaceDocuments = await getMisPlaceCarriers();
    for(let i = 0; i < misPlaceDocuments.length; i++){
        const doc = misPlaceDocuments[i];
        if (!TIDList.includes(doc.operation_id)) {
            await (0, _document.updateMisPlaceDocument)(doc.operation_id);
        }
    }
};
const carrierService = {
    name: 'carrier',
    fns: {
        getAllCarrierData,
        getCarrierDataByCondition,
        getCarrierDataByCabinetId,
        getInPlaceCarrierCount,
        getMisPlaceCarriers,
        updateCarrier
    }
};
const _default = carrierService;

//# sourceMappingURL=carrier-service.js.map