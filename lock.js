const Gpio = require('orange-pi-gpio');
const eventEmitter = require('./emit');

console.log('starting lock')

let prevState = 0

const gpio23 = new Gpio({
  pin: 23, mode: 'in', ready: () => {
    setInterval(function() {
      gpio23.read()
        .then((state) => {
          if (prevState === 0 && state === 1) {
            console.log('pin 23 -' + state)
            eventEmitter.emit('startRfidReading');
          }

          prevState = state;
        });
    }, 200)
  }
});

const gpio25 = new Gpio({
  pin: 25, mode: 'in', ready: () => {
    // setInterval(function() {
    //   gpio25.read()
    //     .then((state) => {
    //       console.log('pin 25 -' + state);
    //     });
    // }, 200)
  }
});



