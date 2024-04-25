// 出入方向
export enum AccessDirection {
  IN = 1,
  OUT = 2,
  ALL = 3,
}

export enum AccessHasAlarm {
  ALL = 3,
  HAS_ALARM = 1,
  NO_ALARM = 0,
}

export enum AccessTimeRange {
  ALL,
  TODAY,
  WEEK,
  MONTH,
}

export enum AccessWithCarrier {
  ALL,
  WITH_CARRIER,
  WITHOUT_CARRIER,
}

// 报警记录处理状态
export enum OperationStatus {
  UNPROCESSED = 0,
  PROCESSED = 1,
}

export enum IsViewed {
  UNVIEWED = 0,
  VIEWED,
}

// 报警状态
export enum AlarmStatus {
  ALARMED = 1,
  UNALARMED = 0,
}

// 审批状态
export enum ApprovalStatus {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
}

// GPO 索引
export enum GPOIndex {
  ONE = 1,
  TWO = 2,
}

// GPI 索引
export enum GPIIndex {
  ONE = 0,
  TWO = 1,
}

// 设备类型
export enum EquipmentType {
  CONTROL = 1,
  DEVICE = 2,
}

// 消息类型
export enum MessageType {
  HEARTBEAT = '00011112',
  READ_EPC = '00010210',
  BASE_STOP = '000102FF',
  SET_GPO = '00010109',
  SET_GPI_TRIGGER = '0001010B',
  RECEIVE_GPI_TRIGGER_START_REPORT = '00011100',
  RECEIVE_GPI_TRIGGER_STOP_REPORT = '00011201',
  RECEIVE_EPC_REPORT = '00011200',
}

// 当前激活设备状态
export enum ActiveEquipmentState {
  CHECKING,
  CHECKED,
  ALARMING,
  VIEWING,
}
