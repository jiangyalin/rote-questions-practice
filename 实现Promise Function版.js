function MyPromise (fun) {
  this.status = 'pending'
  this.onResolve = []
  this.onReject = []
  this.value = null
  this.reason = null

  const schedule = (cb, data) => {
    if (typeof queueMicrotask === 'function') {
      queueMicrotask(() => cb(data))
      return
    }
    setTimeout(() => cb(data), 0)
  }

  const adoptResult = (result, resolve, reject) => {
    if (result instanceof MyPromise) {
      result.then(resolve)
      result.catch(reject)
      return
    }

    resolve(result)
  }

  const resolve = (data) => {
    if (this.status !== 'pending') return
    this.status = 'resolved'
    this.value = data
    this.onResolve.forEach((cb) => schedule(cb, data))
  }

  const reject = (data) => {
    if (this.status !== 'pending') return
    this.status = 'rejected'
    this.reason = data
    this.onReject.forEach((cb) => schedule(cb, data))
  }

  if (typeof fun !== 'function') {
    throw new TypeError()
  }

  try {
    fun(resolve, reject)
  } catch (err) {
    reject(err)
  }

  this.then = (fun) => {
    return new MyPromise((resolve, reject) => {
      const handler = (data) => {
        try {
          const result = typeof fun === 'function' ? fun(data) : data
          adoptResult(result, resolve, reject)
        } catch (err) {
          reject(err)
        }
      }

      const rejectHandler = (reason) => {
        reject(reason)
      }

      this.onResolve.push(handler)
      this.onReject.push(rejectHandler)

      if (this.status === 'resolved') schedule(handler, this.value)
      if (this.status === 'rejected') schedule(rejectHandler, this.reason)
    })
  }

  this.catch = (fun) => {
    return new MyPromise((resolve, reject) => {
      const resolveHandler = (value) => {
        resolve(value)
      }

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
