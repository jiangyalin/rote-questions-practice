const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function MyPromise (fun) {
  this.status = 'PENDING'
  this.onResolve = null
  this.onReject = null
  const resolve = (data) => {
    if (this.status !== 'PENDING') return
    this.status = 'RESOLVED'
    if (typeof this.onResolve === 'function') this.onResolve(data)
  }

  const reject = (data) => {
    if (this.status !== 'PENDING') return
    this.status = 'REJECTED'
    if (typeof this.onReject === 'function') this.onReject(data)
  }

  try {
    fun(resolve, reject)
  } catch (err) {
    reject(err)
  }

  this.then = (fun) => {
    if (typeof fun === 'function') this.onResolve = fun
    return this
  }
  this.catch = (fun) => {
    if (typeof fun === 'function') this.onReject = fun
    return this
  }
}

const test = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('这是测试数据')
  }, 2000)
})

test
console.log('test', test)
