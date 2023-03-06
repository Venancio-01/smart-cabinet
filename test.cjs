const arr = [1, 2, 3].map(item => item + 1)

const myMap = function (fn) {
  const result = []

  for (let i = 0; i < this.length; i++) {
    result.push(fn(this[i], i, this))
  }
  return result
}

Array.prototype.myMap = myMap

const arr2 = [1, 2, 3].myMap(item => item + 1)

console.log(arr, 'arr')
console.log(arr2, 'arr2')
