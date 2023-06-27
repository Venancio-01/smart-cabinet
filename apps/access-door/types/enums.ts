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
