// 模拟 next 方法返回值
function makeIterator(array) {
  var nextIndex = 0
  return {
    next: function() {
      return nextIndex < array.length ? {value: array[nextIndex++], done: false} : {value: undefined, done: true}
    }
  }
}

class RangeIterator {
  constructor(start, stop) {
    this.value = start
    this.stop = stop
  }

  [Symbol.iterator]() {return this}

  next() {
    var value = this.value
    if (value < this.stop) {
      this.value++
      return {
        done: false,
        value: value
      }
    }
    return {
      done: true,
      value: undefined
    }
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop)
}

for (var value of range(0, 3)) {
  console.log(value)
}

// 通过遍历器实现指针结构
function Obj(value) {
  this.value = value
  this.next = null
}

Obj.prototype[Symbol.iterator] = function() {
  var iterator = { next: next }
  var current = this

  function next() {
    if (current) {
      var value = current.value
      current = current.next
      return { done: false, value: value }
    } else {
      return { done: true }
    }
  }
  return iterator
}

var one = new Obj(1)
var two = new Obj(2)
var three = new Obj(3)

one.next = two
two.next = three

for (var i of one) {
  console.log(i)
}

// 为对象添加 Iterator 接口
let obj = {
  data: ['hellow', 'world'],
  [Symbol.iterator]() {
    const self = this
    let index = 0
    return {
      next() {
        if (index < self.data.length) {
          return { value: self.data[index++], done: false }
        } else {
          return { value: undefined, done: true }
        }
      }
    }
  }
}

// 类似数组的对象（存在数值键名和length属性），可以用 Symbol.iterator 方法直接引用数组的 Iterator 接口
let iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
}
for (let item of iterable) {
  console.log(item)
}


// 覆盖原生的 Symbol.iterator 方法，达到修改遍历器行为的目的
var str = new String('hi')

str[Symbol.iterator] = function() {
  return {
    next: function() {
      if (this._first) {
        this._first = false
        return { value: 'bye', done: false }
      } else {
        return { done: true }
      }
    },
    _first: true
  }
}
// [...str] -> ["bye"]

// for...of 遍历对象
// 1、用 Object.keys 方法将对象的键名生成一个数组，然后遍历这个数组
for (var key of Object.keys(obj)) {
  console.log(key + ': ' + 'obj[key')
}
// 2、用 Generator 函数将对象重新包装下
function* entries(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]]
  }
}

for (let [key, value] of entries(obj)) {
  console.log(key, '->', value)
}

// 使用 break 跳出 for...of
for (var n of arr) {
  if (n > 1000)
    break
  console.log(n)
}

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