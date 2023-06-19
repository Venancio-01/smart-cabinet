export enum AccessDirection {
  ALL = 0,
  IN,
  OUT,
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

export enum IsViewed {
  UNVIEWED = 0,
  VIEWED,
}
