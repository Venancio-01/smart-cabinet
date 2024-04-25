const ipcNames = {
  renderer: {
    triggerStart: 'trigger-start',
    readData: 'read-data',
    detectAlarm: 'detect-alarm',
  },
  accessDoor: {
    getIsControlEquipment: 'get-is-control-equipment',
    getEquipmentList: 'get-equipment-list',
    getControlEquipment: 'get-control-equipment',
    selectDoorRfidrecordList: 'select-door-rfidrecord-list',
    selectDoorRfidrecordListWithPage: 'select-door-rfidrecord-list-with-page',
    selectDoorAlarmRecordList: 'select-door-alarm-record-list',
    selectDoorAlarmRecordListWithPage: 'select-door-alarm-record-list-with-page',
    selectDoorAlarmRecordCount: 'select-door-alarm-record-count',
    updateDoorAlarmRecord: 'update-door-alarm-record',
    updateManyDoorAlarmRecord: 'update-many-door-alarm-record',
  },
  network: {
    getDatabaseConnectState: 'get-database-connect-state',
  },
  rfid: {
    getRfidConnectionStatus: 'get-rfid-connection-status',
    handleSetGPO: 'rfid:handle-set-gpo',
  },
  sys: {
    selectSysDeptList: 'select-sys-deptList',
    getProductionBgImagePath: 'get-production-bg-image-path',
    generateRegistrationCode: 'generate-registration-code',
    generateActivationCode: 'generate-activation-code',
    compareActivationCode: 'compare-activation-code',
  },
  store: {
    get: 'store:get',
    set: 'store:set',
    delete: 'store:delete',
  },
}

for (const item of Object.keys(ipcNames)) {
  const name = ipcNames[item]
  for (const key of Object.keys(name)) {
    name[key] = `${item}-${name[key]}`
  }
}

export default ipcNames
