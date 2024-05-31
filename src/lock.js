const Gpio = require('orange-pi-gpio');
const eventEmitter = require('./utils/emit');
const logger = require('./utils/logger');

let prevState = 0;
let lastDebounceTime = 0;

const gpio19 = new Gpio({
  pin: 19, mode: 'in', ready: () => {
    setInterval(function() {
      gpio19.read()
        .then((state) => {
          logger.info('pin 19 通电状态: ' + state);

          // 检查从低电平到高电平的变化
          if (prevState === 0 && state === 1) {
            logger.info('level changed');
            // eventEmitter.emit('startRfidReading');
          }

          prevState = state;
        });
    }, 100)
  }
});

const gpio25 = new Gpio({
  pin: 25, mode: 'out', ready: () => {
    gpio25.write(1);
  }
});



