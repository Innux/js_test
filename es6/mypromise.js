/* 
  1. Promise 对象初始状态为 Pending， 在被 resolve 或 reject 时，状态变为 Fulfilled 或 Rejected
  2. resolve 接收成功的数据，reject 接收失败或错误的数据
  3. Promise 对象必须有一个 then 方法，且只接受两个函数参数 onFulfilled、 onRejected
 */

// 一个 Promise 构造函数 和一个实例方法 then 就是 Promise 的核心
function Promise(resolver) {
  if (resolver && typeof resolver !== 'function') {
    throw new Error('not a function')
  }

  this.state = PENDING
  this.data = UNDEFINED
  this.callbackQueue = []

  if(resolver) {
    executeResolver.call(this, resolver)
  }
}

Promise.prototype.then = function() {}

function executeResolver(resolver) {
  var called = false
  var _this = this

  function onError(value) {
    if (called) return
    called = true
    // 如果错误，使用 reject 方法
    executeCallback.bind(_this)('reject', value)
  }

  function onSuccess(value) {
    if (called) return
    called = true
    // 如果成功，使用 resolve 方法
    executeCallback.bind(_this)('resolve', value)
  }

  try {
    resolver(onSuccess, onError)
  } catch (e) {
    onError(e)
  }
}

function executeCallback(type, x) {
  var isResolve = type === 'resolve'
  var thenable

  if (isResolve && (typeof x === 'object' || typeof x === 'function')) {
    try {
      thenable = getThen(x)
    } catch(e) {
      return executeCallback.bind(this)('reject', e)
    }
  }

  if (isResolve && thenable) {
    executeResolver.bind(this)(thenable)
  } else {
    this.state = isResolve ? RESOLVED : REJECTED
    this.data = x
    this.callbackQueue && this.callbackQueue.length && this.callbackQueue.forEach(v => v[type](x))
  }
  return this
}

// 判断是否是 thenable 对象
function getThen(obj) {
  var then = obj && obj.then
  if (obj && typeof obj === 'obj' && typeof then === 'function') {
    return function appyThen() {
      then.apply(obj, arguments)
    }
  }
}