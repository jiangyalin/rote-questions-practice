class MyPromise {
  constructor (executor) {
    this.status = 'PENDING'
    this.onResolve = null
    this.onReject = null
    const resolve = (data) => {
      if (this.status !== 'PENDING') return
      if (typeof this.onResolve === 'function') this.onResolve(data)
      this.status = 'RESOLVED'
    }
    const reject = (data) => {
      if (this.status !== 'PENDING') return
      if (typeof this.onReject === 'function') this.onReject(data)
      this.status = 'REJECTED'
    }
    try {
      executor(resolve, reject)
    } catch {
      reject()
    }
  }

  then (fn) {
    if (typeof fn !== 'function') return
    this.onResolve = fn
    return this
  }

  catch (fn) {
    if (typeof fn !== 'function') return
    this.onReject = fn
    return this
  }
}

const test = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('这是测试数据')
  }, 2000)
})

test.then(res => {
  console.log('res', res)
}).catch(err => {
  console.log('err', err)
})
console.log('test', test)
