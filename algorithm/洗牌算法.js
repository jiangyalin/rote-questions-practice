/**
 * 标记，翻了答案，需重做
 * round 四舍五入
 * random 获取0到1的随机数
 * floor 向下取整
 * 3.21翻了答案后重做，失误做错了
 * */
// const shuffle = (arr = []) => {
//   for (let i = 0; i < arr.length; i++) {
//     const j = i + Math.floor(Math.random() * (arr.length - i))
//     ;[arr[i], arr[j]] = [arr[j], arr[i]]
//   }
//   return arr
// }
const shuffle = (arr = []) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

if (require.main === module) {
  const arr = [1, 2, 3, 4, 5]

  console.log(shuffle(arr))
}
