export default {
  '00011112': 'HeartBeat',
  '00010210': 'ReadEPC',
  '000102FF': 'BaseStop',
  '00010109': 'SetGPO',
  '0001010B': 'SetGPITrigger',
  '00011100': 'ReceiveGPITriggerStartReport',
  '00011201': 'ReceiveGPITriggerStopReport',
  '00011200': 'ReceiveEPCReport',
} as {
  readonly [key: string]: string
}
