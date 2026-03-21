/** 标记，需重做 */
/** 3.21，重做正确 */
const debounce = (fun, time = 100) => {
  let timeout = null
  return (...age) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fun.apply(this, age)
    }, time)
  }
}

const test = (text = '') => {
  console.log('xxx' + text)
}

const testDebounce = debounce(test, 1000)

testDebounce('aa')
testDebounce('bb')
testDebounce('cc')
testDebounce('dd')
testDebounce('ee')
testDebounce('ff')
