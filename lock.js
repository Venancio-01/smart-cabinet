const Gpio = require('orange-pi-gpio');

const gpio23 = new Gpio({
  pin: 23, mode: 'in', ready: () => {
    setInterval(function() {
      gpio23.read()
        .then((state) => {
          console.log('pin 23 -' + state); //state of pin 23
        });
    }, 200)
  }
});

const gpio25 = new Gpio({
  pin: 25, mode: 'in', ready: () => {
    setInterval(function() {
      gpio25.read()
        .then((state) => {
          console.log('pin 25 -' + state);
        });
    }, 200)
  }
});



