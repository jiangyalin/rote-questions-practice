/**
 * 标记，需重做
 * */
const fastSort = (arr = [], left = 0, right = arr.length - 1) => {
  if (left < right) {
    const pivot = arr[left]
    let i = left + 1
    for (let j = i; j < right + 1; j++) {
      if (arr[j] < pivot) {
        [arr[i], arr[j]] = [arr[j], arr[i]]
        i++
      }
    }
    ;[arr[left], arr[i - 1]] = [arr[i - 1], arr[left]]

    fastSort(arr, left, i - 2)
    fastSort(arr, i, right)
  }
  return arr
}

if (require.main === module) {
  const arr = [3, 5, 9, 4, 6, 9, 5, 1]

  console.log(fastSort(arr))
}
