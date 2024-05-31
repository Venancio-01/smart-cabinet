const Gpio = require('orange-pi-gpio');
const eventEmitter = require('./utils/emit');
const logger = require('./utils/logger');

let debounceTimer = null;
let prevState = null

const gpio19 = new Gpio({
  pin: 19, mode: 'in', ready: () => {
    setInterval(function() {
      gpio19.read()
        .then((state) => {
          if (prevState !== state) {
            logger.info('pin 19 通电变化: ' + state);
          }

          if (state === '1') {
            if (debounceTimer) {
              return
            }
            debounceTimer = setTimeout(() => {
              logger.info('level changed');
              debounceTimer = null;

              eventEmitter.emit('startRfidReading');
            }, 2000);
          } else if (state === '0') {
            if (debounceTimer) {
              clearTimeout(debounceTimer);
              debounceTimer = null;
            }
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



