// 登录后操作超时时长,单位秒
export const OPERATION_TIMEOUT = 90
// 确认结果操作超时时长,单位秒
export const CONFIRM_TIMEOUT = 20

// 三种登录方式索引
export const PASSWORD_KEY = 1
export const FINGER_KEY = 2
export const CARD_KEY = 3

// 查询 RFID 连接间隔
export const QUERY_RFID_INTERVAL = 3000
// 盘点时长,单位秒
export const CHECK_TIME = 10

// 查询指纹仪连接间隔
export const QUERY_FINGER_INTERVAL = 3000
// 指纹仪登记、注册方法轮询间隔
export const FINGER_POLLING_INTERVAL = 200

// 查询锁控板间隔
export const QUERY_LOCK_INTERVAL = 3000
// 发送锁控状态命令
export const SEND_QUERY_COMMAND_INTERVAL = 1000
// 查询锁控状态
export const QUERY_OPEN_STATE_INTERVAL = 1000

// 查询数据库连接间隔
export const QUERY_NETWORK_INTERVAL = 3000

// 检测页面停留时间
export const CHECK_PAGE_STAY_DURATION = 1000 * 3

// 告警页面停留时间
export const ALARM_PAGE_STAY_DURATION = 1000 * 10
