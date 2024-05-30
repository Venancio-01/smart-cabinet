const pino = require('pino');

const logger = pino({
  transport: {
    target: 'pino-pretty',
  }
});

// 记录信息级别的日志
logger.info('This is an info message');
// 记录错误级别的日志
logger.error('This is an error message');


module.exports = logger
