const test = (str = '') => {
  const map = {}
  for (let i = 0; i < str.length; i++) {
    if (!map[str[i]]) map[str[i]] = 0
    map[str[i]]++
  }
  let min = str.length
  for (key in map) {
    if (map[key] < min) min = map[key]
  }

  let _str = ''
  for (let i = 0; i < str.length; i++) {
    if (map[str[i]] > min) _str += str[i]
  }

  return _str
}

if (require.main === module) {
  const testData1 = 'ababac'
  console.log(test(testData1) === 'ababa')

  const testData2 = 'aaabbbcceeff'
  console.log(test(testData2) === 'aaabbb')
}
