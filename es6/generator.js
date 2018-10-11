// 异步任务封装
var fetch = require('node-fetch')

function* gen() {
  var url = 'www.xxx.com'
  var result = yield fetch(url)
  console.log(result.bio)
}

var g = gen()
var result = g.next()

result.value.then(function(data) {
  return data.json()
}).then(function(data) {
  g.next(data)
})

// Thunk 函数
function f(m) {
  return m * 2
}
f(x + 5)
// 等同于
var thunk = function() {
  return x + 5
}
function f(thunk) {
  return thunk() * 2
}

// 正常版本的 readFile （多参数版本）
fs.readFile(filename, callback)
// Thunk 版本的 readFile （单参数版本）
var Thunk = function (filename) {
  return function (callback) {
    return fs.readFile(filename, callback)
  }
}

var readFileThunk = Thunk(filename)
readFileThunk(callback)

// 任何函数只要参数有回调函数，就能写成 Thunk 函数的形式。
// Thunk 函数转换器
const Thunk = function(fn) {
  return function (...args) {
    return function (callback) {
      return fn.call(this, ...args, callback)
    }
  }
}

var readFileThunk = Thunk(fs.readFile)
readFileThunk(fileA)(callback)

// generator 函数自动执行
function* gen() {
  // ...
}
var g = gen()
var res = g.next()
while(!res.done) {
  console.log(res.value)
  res = g.next()
}
// 以上不适合异步操作
// 为了保证前一步执行完，才能执行后一步，Thunk 函数能派上用场
var fs = require('fs')
var thunkify = require('thunkify')
var readFileThunk = thunkify(fs.readFile)

var gen = function* () {
  var r1 = yield readFileThunk('/etc/xx')
  console.log(r1.toString())
  var r2 = yield readFileThunk('/etc/xx2')
  console.log(r2.toString())
}
// 以上代码，yield 命令用于将程序的执行权移除 Generator 函数， Thunk 函数将执行权再交还给 Generator 函数
// Thunk 函数可以在回调函数里，将执行权交还给 Generator 函数
var g = gen()
var r1 = g.next()
r1.value(function (err, data) {
  if (err) throw err
  var r2 = g.next(data)
  r2.value(function (err, data) {
    if (err) throw err
    g.next(data)
  })
})
// 上面代码，变量 g 是 Generator 函数的内部指针，表示目前执行到哪一步。next 方法负责指针移动到下一步，并返回该步的信息（value和done属性）
// Generator 函数的执行过程，其实是将同一个回调函数麻烦付传入 next 方法的 value 属性。这使得我们可以用递归来自动完成这个过程。


// 基于 Thunk 函数的 Generator 执行器
function run(fn) {
  var gen = fn()

  function next(err, data) {
    var result = gen.next(data)
    if (result.done) return
    result.value(next)
  }
  next()
}

function* g() {
  // ...
}

run(g)
// 上面的 run 函数，就是一个Generator 函数的自动执行器。内部的 next 函数就是 Thunk 的回调函数。
//  next 函数先将指针移动到 Generator 函数的下一步(gen.next 方法)，然后判断 Generator 函数是否结束，如果没结束，就将 next 函数再传入 Thunk 函数，否则直接退出


// 基于 Promise 对象的自动执行
var fs = require('fs')
var readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error)
      resolve(data)
    })
  })
}
var gen = function* () {
  var f1 = yield readFile('/etc/xxx')
  var f2 = yield readFile('/etc/xxx2')
  console.log(f1.toString())
  console.log(f2.toString())
}

var g = gen()
g.next().value.then(function(data) {
  g.next(data).value.then(function(data) {
    g.next(data)
  })
})