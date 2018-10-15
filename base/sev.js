function factorial(num) {
  if (num <= 1) {
    return 1
  } else {
    return num * arguments.callee(num - 1)
  }
}

// 严格模式可以使用命名函数表达式
var factorial = (function f(num){
  if (num <= 1) {
    return 1
  } else {
    return num * f(num - 1)
  }
})