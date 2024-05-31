const Gpio = require('orange-pi-gpio');
const eventEmitter = require('./utils/emit');
const logger = require('./utils/logger');

let debounceTimer = null;
let flag = false;

const gpio19 = new Gpio({
  pin: 19, mode: 'in', ready: () => {
    setInterval(function() {
      gpio19.read()
        .then((state) => {
          logger.info('pin 19 通电状态: ' + state);

          if (state === '1') {
            if (debounceTimer || flag) {
              return
            }
            debounceTimer = setTimeout(() => {
              logger.info('level changed');
              // eventEmitter.emit('startRfidReading');
              debounceTimer = null; // Reset the debounce timer
              flag = true;
            }, 500);
          } else if (state === '0') {
            if (debounceTimer) {
              clearTimeout(debounceTimer);
              debounceTimer = null; // Reset the debounce timer
            }

            flag = false
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



