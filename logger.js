const pino = require('pino');
const pretty = pino.pretty();
pretty.pipe(process.stdout); // 同时在控制台输出
pretty.pipe(require('fs').createWriteStream('app.log')); // 保存到文件

const logger = pino(pretty);

// 记录信息级别的日志
logger.info('This is an info message');
// 记录错误级别的日志
logger.error('This is an error message');


module.exports = logger
