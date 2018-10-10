// 参数默认值
function fc(url, time = 2000, callback = function() {}) {
  // ... 
}

// 返回一个对象字面量
var getItem = id => ({id: id, name: 'tmp'})

// 立即执行函数
let p = ((name) => {
  return {
    getName: function() {
      return name
    }
  }
})('namesss')