function MyPromise (fun) {
  this.status = 'pending'
  this.onResolve = []
  this.onReject = []
  this.value = null
  this.reason = null

  if (typeof fun !== 'function') {
    throw new TypeError()
  }

  // 统一回调触发时机，避免同步执行打乱链路。
  const schedule = (cb, data) => {
    // 尽量按 Promise 语义异步触发回调，优先微任务，降级到宏任务。
    if (typeof queueMicrotask === 'function') {
      queueMicrotask(() => cb(data))
      return
    }
    setTimeout(() => cb(data), 0)
  }

  // 采纳回调返回值：若返回 Promise 则等待其结果，否则直接 resolve。
  const adoptResult = (result, resolve, reject) => {
    // 采纳 then/catch 回调返回的 Promise，保证链式调用能继续传递状态。
    if (result instanceof MyPromise) {
      result.then(resolve)
      result.catch(reject)
      return
    }

    resolve(result)
  }

  // 兑现 Promise：记录值并触发成功回调队列。
  const resolve = (data) => {
    // Promise 状态只能从 pending 落定一次。
    if (this.status !== 'pending') return
    this.status = 'resolved'
    this.value = data
    this.onResolve.forEach((cb) => schedule(cb, data))
  }

  // 拒绝 Promise：记录原因并触发失败回调队列。
  const reject = (data) => {
    // Promise 状态只能从 pending 落定一次。
    if (this.status !== 'pending') return
    this.status = 'rejected'
    this.reason = data
    this.onReject.forEach((cb) => schedule(cb, data))
  }

  try {
    fun(resolve, reject)
  } catch (err) {
    reject(err)
  }

  // then 处理成功分支，并返回新的 Promise 供链式调用。
  this.then = (fun) => {
    // then 必须返回一个新的 Promise，供后续链式调用。
    return new MyPromise((resolve, reject) => {
      // 执行成功回调，并把返回值交给下一个 Promise。
      const handler = (data) => {
        try {
          const result = typeof fun === 'function' ? fun(data) : data
          adoptResult(result, resolve, reject)
        } catch (err) {
          reject(err)
        }
      }

      // 当前 Promise 失败且 then 未提供失败处理时，错误继续向后传递。
      const rejectHandler = (reason) => {
        reject(reason)
      }

      this.onResolve.push(handler)
      this.onReject.push(rejectHandler)

      if (this.status === 'resolved') schedule(handler, this.value)
      if (this.status === 'rejected') schedule(rejectHandler, this.reason)
    })
  }

  // catch 处理失败分支，并返回新的 Promise 继续链路。
  this.catch = (fun) => {
    // catch 本质是只处理拒绝分支，并把结果继续传给后续链路。
    return new MyPromise((resolve, reject) => {
      // 上游成功时，直接把值透传给后续链路。
      const resolveHandler = (value) => {
        resolve(value)
      }

      // 执行失败回调，并把返回值交给下一个 Promise。
      const rejectHandler = (reason) => {
        try {
          if (typeof fun !== 'function') {
            reject(reason)
            return
          }
          const result = fun(reason)
          adoptResult(result, resolve, reject)
        } catch (err) {
          reject(err)
        }
      }

      this.onResolve.push(resolveHandler)
      this.onReject.push(rejectHandler)

      if (this.status === 'resolved') schedule(resolveHandler, this.value)
      if (this.status === 'rejected') schedule(rejectHandler, this.reason)
    })
  }
}

module.exports = MyPromise

if (require.main === module) {
  const promise = new MyPromise((resolve, reject) => {
    reject('boom')
  })

  promise
    .then((v) => v)
    .catch((err) => {
      console.log('v', err)
    })
}
