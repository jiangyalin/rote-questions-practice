const fs = require('fs')
const path = require('path')
const vm = require('vm')

const algorithmFilePath = path.resolve(__dirname, '../../algorithm/反转二叉树.js')

const loadReverse = () => {
  const code = fs.readFileSync(algorithmFilePath, 'utf8')
  const sandbox = {
    module: { exports: {} },
    exports: {},
    require: { main: {} },
    console: {
      log: () => {
      }
    }
  }

  vm.runInNewContext(`${code}\nmodule.exports = reverse`, sandbox)
  return sandbox.module.exports
}

const createNode = (value, left = null, right = null) => ({
  value,
  left,
  right
})

describe('反转二叉树', () => {
  test('应能读取到 reverse 函数', () => {
    const reverse = loadReverse()

    expect(typeof reverse).toBe('function')
  })

  test('传入 null 时应返回 null', () => {
    const reverse = loadReverse()

    expect(reverse(null)).toBeNull()
  })

  test('单节点二叉树反转后结构不变', () => {
    const reverse = loadReverse()
    const tree = createNode(1)

    const result = reverse(tree)

    expect(result).toBe(tree)
    expect(result).toEqual(createNode(1))
  })

  test('只有左子树时应反转到右边', () => {
    const reverse = loadReverse()
    const tree = createNode(1, createNode(2, createNode(3)))

    const result = reverse(tree)

    expect(result).toEqual(
      createNode(
        1,
        null,
        createNode(
          2,
          null,
          createNode(3)
        )
      )
    )
  })

  test('只有右子树时应反转到左边', () => {
    const reverse = loadReverse()
    const tree = createNode(1, null, createNode(2, null, createNode(3)))

    const result = reverse(tree)

    expect(result).toEqual(
      createNode(
        1,
        createNode(
          2,
          createNode(3),
          null
        ),
        null
      )
    )
  })

  test('完整二叉树应正确反转', () => {
    const reverse = loadReverse()
    const tree = createNode(
      1,
      createNode(2, createNode(4), createNode(5)),
      createNode(3, createNode(6), createNode(7))
    )

    const result = reverse(tree)

    expect(result).toBe(tree)
    expect(result).toEqual(
      createNode(
        1,
        createNode(3, createNode(7), createNode(6)),
        createNode(2, createNode(5), createNode(4))
      )
    )
  })

  test('包含空子节点的非对称树应正确反转', () => {
    const reverse = loadReverse()
    const tree = createNode(
      1,
      createNode(2, null, createNode(5)),
      createNode(3, createNode(6), null)
    )

    const result = reverse(tree)

    expect(result).toEqual(
      createNode(
        1,
        createNode(3, null, createNode(6)),
        createNode(2, createNode(5), null)
      )
    )
  })

  test('应原地修改原始二叉树对象', () => {
    const reverse = loadReverse()
    const tree = createNode(
      1,
      createNode(2),
      createNode(3)
    )

    const leftNode = tree.left
    const rightNode = tree.right
    const result = reverse(tree)

    expect(result).toBe(tree)
    expect(tree.left).toBe(rightNode)
    expect(tree.right).toBe(leftNode)
  })
})

