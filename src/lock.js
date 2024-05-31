const Gpio = require('orange-pi-gpio');
const eventEmitter = require('./utils/emit');
const logger = require('./utils/logger');

let prevState = 0;
let lastStableState = 0;
let lastDebounceTime = 0;
const debounceDelay = 50; // 50ms的去抖动延迟

const gpio19 = new Gpio({
  pin: 19, mode: 'in', ready: () => {
    setInterval(function() {
      gpio19.read()
        .then((state) => {
          const currentTime = Date.now();

          if (state !== lastStableState) {
            // 如果状态与上次稳定状态不同，则重置去抖动时间
            lastDebounceTime = currentTime;
          }

          if ((currentTime - lastDebounceTime) > debounceDelay) {
            // 如果状态已经稳定超过去抖动延迟时间
            if (lastStableState !== state) {
              lastStableState = state;

              // 检查从低电平到高电平的变化
              if (prevState == 0 && state == 1) {
                logger.info('pin 19 -' + state);
                // eventEmitter.emit('startRfidReading');
              }

              prevState = state;
            }
          }
        });
    }, 200)
  }
});

const gpio25 = new Gpio({
  pin: 25, mode: 'out', ready: () => {
    gpio25.write(1);
  }
});



