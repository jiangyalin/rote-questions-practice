/** 标记，需重做 */
/** 标记3.21查看答案后重做成功 */
const reverse = (tree = {}) => {
  if (tree === null) return null
  const queue = [tree]

  for (let i = 0; i < queue.length; i++) {
    const node = queue[i]
    const _data = node.left
    node.left = node.right
    node.right = _data
    if (node.left) queue.push(node.left)
    if (node.right) queue.push(node.right)
  }

  return tree
}

if (require.main === module) {
  const binaryTree = {
    value: 1,
    left: {
      value: 2,
      left: {
        value: 4,
        left: null,
        right: null
      },
      right: {
        value: 5,
        left: null,
        right: null
      }
    },
    right: {
      value: 3,
      left: null,
      right: null
    }
  }

  console.log(reverse(binaryTree))
}
