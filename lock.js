const Gpio = require('orange-pi-gpio');
const eventEmitter = require('./emit');

let prevState = 0

function debounce(func, delay) {
  let timerId;
  let immediate = true; // 添加一个标志，表示是否立即执行
  return function() {
    const context = this;
    const args = arguments;
    if (immediate) { // 如果是第一次调用，则立即执行函数
      func.apply(context, args);
      immediate = false;
    }
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      immediate = true; // 延时后，将标志重新设为 true
      func.apply(context, args);
    }, delay);
  };
}


const handleCloseDoor = debounce(function(state) {
  if (prevState == 0 && state == 1) {
    console.log('pin 23 -' + state)
    eventEmitter.emit('startRfidReading');
  }

  prevState = state;
}, 300);


const gpio23 = new Gpio({
  pin: 23, mode: 'in', ready: () => {
    setInterval(function() {
      gpio23.read()
        .then((state) => {
          handleCloseDoor(state)
          // if (prevState == 0 && state == 1) {
          //   console.log('pin 23 -' + state)
          //   eventEmitter.emit('startRfidReading');
          // }

          // prevState = state;
        });
    }, 200)
  }
});

const gpio25 = new Gpio({
  pin: 25, mode: 'out', ready: () => {
    // setInterval(function() {
    //   gpio25.read()
    //     .then((state) => {
    //       console.log('pin 25 -' + state);
    //     });
    // }, 200)
  }
});



