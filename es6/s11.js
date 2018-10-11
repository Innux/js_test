// 使用回调函数串联多个调用
readFile('a.txt', function(err, contents) {
  if (err) throw err

  msWriteProfilerMark('a.txt', function(err) {
    if (err) throw err
    console.log('done')
  })
})

function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms, 'done')
  })
}

timeout(100).then((value) => {
  console.log(value)
})

// promise实现ajax
const getJSON = function(url) {
  const promise = new Promise(function(resolve, reject) {
    const handler = function() {
      if (this.readyState !== 4) {
        return
      }
      if (this.status === 200) {
        resolve(this.response)
      } else {
        reject(new Error(this.statusText))
      }
    }

    const client = new XMLHttpRequest()
    client.open('GET', url)
    client.onreadystatechange = handler
    client.responseType = 'json'
    client.setRequestHeader('Accept', 'application/json')
    client.send()
  })

  return promise
}

getJSON('/xxx').then(res => {
  console.log(res)
}).catch(res => {
  console.error(res)
})

// 指定时间内没有获得结果，就将Promise的状态变为reject
const p = Promise.race([
  fetch('/xxx'),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('timeout')), 5000)
  })
])

// Generator函数部署Ajax操作
function* main() {
  var result = yield request('/xxx')
  var resp = JSON.parse(result)
  console.log(resp.value)
}

function request(url) {
  makeAjaxCall(url, function(response) {
    it.next(response)
  })
}

var it = main()
it.next()

// 使用Generator函数执行一个异步任务
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