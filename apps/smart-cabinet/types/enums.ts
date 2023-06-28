export enum BorrowedState {
  Returned,
  Borrowed,
}

export enum AlarmObjectType {
  File = 0,
  Carrier = 1,
  Cabinet = 2,
}

export enum AlarmType {
  Alarm = 0,
  Tip = 1,
}

export enum AlarmContentType {
  CabinetDoorNotClosed = 1,
  FileOverdueUnprocessed = 2,
  IncorrectLocation = 3,
  FileOverdueNotReturned = 4,
  CarrierOverdueNotReturned = 5,
}

export enum OperationStatus {
  Unoperated = 0,
  Operated = 1,
}

export enum InPlaceState {
  IN_CABINET = 0,
  BORROWED = 1,
  MISPLACED = 2,
}
