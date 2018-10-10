var person = [
  {name: 'kk'},
  {name: 'dd'}
]

// 获取所有name值
var name = person.map(item => item.name)

// 有curry函数
var prop = curry((key, obj) => obj[key])
var name = person.map(prop('name')) // person对象遍历(map)获取(prop)name属性

//curry函数实现 第一版
var curry = function (fn) {
  var args = [].slice.call(arguments, 1) //获得除去第一个方法的参数
  return function() {
    var newArgs = args.concat([].slice.call(arguments))
    return fn.apply(this, newArgs)
  }
}

function add(a, b) {
  return a + b
}

var addCurry = curry(add, 1, 2)
addCurry()
var addCurry2 = curry(add, 1)
addCurry2(2)
var addCurry3 = curry(add)
addCurry3(1, 2)

// 第二版
function sub_curry(fn) {
  var args = [].slice.call(arguments, 1)
  return function() {
    return fn.apply(this, args.concat([].slice.call(arguments)))
  }
}

function curry2(fn, length) {
  length = length || fn.length    // fn.length 方法参数的个数
  var slice = Array.prototype.slice

  return function() {
    if (arguments.length < length) {
      var combined = [fn].concat(slice.call(arguments))
      return curry(sub_curry.apply(this, combined), length - arguments.length)
    } else {
      return fn.apply(this, arguments)
    }
  }
}

var fn = curry2(function(a, b, c) {
  return [a, b, c]
})
fn("a", "b", "c") // ["a", "b", "c"]
fn("a", "b")("c") // ["a", "b", "c"]
fn("a")("b")("c") // ["a", "b", "c"]
fn("a")("b", "c") // ["a", "b", "c"]

// easy版
function eCury(fn, args) {
  var length = fn.length
  args = args || []

  return function() {
    var _args = args.slice(0)  // ? why slice

    for (let i = 0; i < arguments.length; i++) {
      _args.push(arguments[i])
    }
    if (_args.length < length) {
      return curry.call(this, fn, _args)
    } else {
      return fn.apply(this, _args)
    }
  }
}

// es6版
var curry = fn =>
    judge = (...args) =>
      args.length === fn.length 
      ? fn(...args) 
      : (...ele) => judge(...args, ...ele)
