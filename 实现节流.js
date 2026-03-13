const throttle = (fun, time = 0) => {
  let log = new Date().getTime()
  return (...arg) => {
    if (new Date().getTime() - log > time) {
      fun(...arg)
      log = new Date().getTime()
    }
  }
}

const test = (txt = '') => {
  console.log('xxx', txt)
}

const testThrottle = throttle(test, 2000)

setInterval(() => {
  testThrottle('123')
}, 100)
