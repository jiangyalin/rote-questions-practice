const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

class MyPromise {
  constructor (executor) {
    this.status = 'PENDING'
    this.onResolve = null
    this.onReject = null
    const resolve = (data) => {
      if (this.status === 'PENDING') {
        this.onResolve(data)
        this.status = 'RESOLVED'
      }
    }
    const reject = (data) => {
      if (this.status === 'PENDING') {
        this.onReject(data)
        this.status = 'REJECTED'
      }
    }
    try {
      executor(resolve, reject)
    } catch {
      reject()
    }
  }

  then (fn) {
    this.onResolve = fn
    return this
  }

  catch (fn) {
    this.onReject = fn
    return this
  }
}

const test = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('这是测试数据')
  }, 2000)

  setTimeout(() => {
    reject('err')
  }, 1000)
})

test.then(res => {
  console.log('res', res)
}).catch(err => {
  console.log('err', err)
})
console.log('test', test)
