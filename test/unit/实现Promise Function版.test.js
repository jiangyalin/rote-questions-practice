const MyPromise = require('../../实现Promise Function版')

describe('实现Promise Function版 demo', () => {
  test('executor 不是函数时应抛 TypeError', () => {
    expect(() => {
      new MyPromise(null)
    }).toThrow(TypeError)
  })

  test('then 应返回新的 Promise（当前返回 this）', () => {
    const promise = new MyPromise((resolve) => {
      resolve('ok')
    })

    const next = promise.then((v) => v)
    expect(next).not.toBe(promise)
  })

  test('链式 then 应传递回调返回值', (done) => {
    const promise = new MyPromise((resolve) => {
      resolve(1)
    })

    promise
      .then((v) => v + 1)
      .then((v) => {
        expect(v).toBe(2)
        done()
      })
  })

  test('then 回调抛错应被后续 catch 捕获', (done) => {
    const promise = new MyPromise((resolve) => {
      resolve('ok')
    })

    promise
      .then(() => {
        throw new Error('then boom')
      })
      .catch((err) => {
        expect(err).toBeInstanceOf(Error)
        expect(err.message).toBe('then boom')
        done()
      })
  })

  test('then 返回 Promise 时应进行状态采纳', (done) => {
    const promise = new MyPromise((resolve) => {
      resolve('start')
    })

    promise
      .then(() => new MyPromise((resolve) => {
        setTimeout(() => resolve('nested ok'), 10)
      }))
      .then((v) => {
        expect(v).toBe('nested ok')
        done()
      })
  })

  test('reject 应在 then(仅成功回调) 后继续向后传递到 catch', (done) => {
    const promise = new MyPromise((resolve, reject) => {
      reject('boom')
    })

    promise
      .then((v) => v)
      .catch((err) => {
        expect(err).toBe('boom')
        done()
      })
  })

  test('catch 回调返回值应传递给后续 then', (done) => {
    const promise = new MyPromise((resolve, reject) => {
      reject('fail')
    })

    promise
      .catch(() => 'recovered')
      .then((v) => {
        expect(v).toBe('recovered')
        done()
      })
  })

  test('[基础题低频] then 返回 thenable 时应进行状态采纳（不应只支持 MyPromise 实例）', (done) => {
    const thenable = {
      then: (resolve) => {
        setTimeout(() => resolve('thenable ok'), 10)
      }
    }

    const promise = new MyPromise((resolve) => {
      resolve('start')
    })

    promise
      .then(() => thenable)
      .then((v) => {
        expect(v).toBe('thenable ok')
        done()
      })
  })

  test('已 resolve 后 then 回调应异步触发（当前是同步）', (done) => {
    const order = []

    const promise = new MyPromise((resolve) => {
      resolve('ok')
    })

    promise.then(() => {
      order.push('then')
    })
    order.push('sync-end')

    expect(order).toEqual(['sync-end'])

    setTimeout(() => {
      expect(order).toEqual(['sync-end', 'then'])
      done()
    }, 0)
  })

  test('[基础题低频] then 回调应按微任务时序执行（优先于 setTimeout）', (done) => {
    const order = []

    const promise = new MyPromise((resolve) => {
      resolve('ok')
    })

    promise.then(() => {
      order.push('then')
    })

    setTimeout(() => {
      order.push('timeout')
      expect(order).toEqual(['then', 'timeout'])
      done()
    }, 0)
  })

  test('同步 resolve 后再 then，也能拿到结果', (done) => {
    const promise = new MyPromise((resolve) => {
      resolve('ok')
    })

    const onResolve = jest.fn()
    promise.then(onResolve)

    setTimeout(() => {
      expect(onResolve).toHaveBeenCalledWith('ok')
      expect(promise.status).toBe('resolved')
      expect(promise.value).toBe('ok')
      done()
    }, 0)
  })

  test('异步 resolve 时，then 会被调用', (done) => {
    const promise = new MyPromise((resolve) => {
      setTimeout(() => resolve('async ok'), 10)
    })

    promise.then((value) => {
      expect(value).toBe('async ok')
      expect(promise.status).toBe('resolved')
      done()
    })
  })

  test('reject 时，catch 会收到错误', (done) => {
    const promise = new MyPromise((resolve, reject) => {
      setTimeout(() => reject('fail'), 10)
    })

    promise.catch((reason) => {
      expect(reason).toBe('fail')
      expect(promise.status).toBe('rejected')
      expect(promise.reason).toBe('fail')
      done()
    })
  })

  test('executor 抛错时，会走 catch', (done) => {
    const promise = new MyPromise(() => {
      throw new Error('boom')
    })

    const onReject = jest.fn()
    promise.catch(onReject)

    setTimeout(() => {
      expect(onReject).toHaveBeenCalledTimes(1)
      expect(onReject.mock.calls[0][0]).toBeInstanceOf(Error)
      expect(onReject.mock.calls[0][0].message).toBe('boom')
      done()
    }, 0)
  })

  test('[基础题低频] 应支持多个 then 回调（当前会被后注册覆盖）', (done) => {
    const promise = new MyPromise((resolve) => {
      resolve('ok')
    })

    const first = jest.fn()
    const second = jest.fn()

    promise.then(first)
    promise.then(second)

    setTimeout(() => {
      expect(first).toHaveBeenCalledWith('ok')
      expect(second).toHaveBeenCalledWith('ok')
      done()
    }, 0)
  })

  test('[基础题低频] 应支持多个 catch 回调（当前会被后注册覆盖）', (done) => {
    const promise = new MyPromise((resolve, reject) => {
      reject('fail')
    })

    const first = jest.fn()
    const second = jest.fn()

    promise.catch(first)
    promise.catch(second)

    setTimeout(() => {
      expect(first).toHaveBeenCalledWith('fail')
      expect(second).toHaveBeenCalledWith('fail')
      done()
    }, 0)
  })

  test('[基础题低频] then 返回自身应 reject TypeError（防循环引用）', (done) => {
    const promise = new MyPromise((resolve) => {
      resolve('ok')
    })

    let next
    next = promise.then(() => next)

    const failTimer = setTimeout(() => {
      done(new Error('循环引用未被拒绝，链路处于挂起状态'))
    }, 30)

    next.catch((err) => {
      clearTimeout(failTimer)
      expect(err).toBeInstanceOf(TypeError)
      done()
    })
  })
})
