new Promise(resolve => {
  console.log(1)
  setTimeout(() => {
    console.log(2)
    resolve()
    console.log(3)
  })
}).then(() => {
  throw new Error('fail')
}).then(() => {
  console.log(4)
}).then(() => {
  console.log(5)
}, () => {
  console.log(6)
}).then(() => {
  console.log(7)
})

console.log(8)



// ===============================
const p = Promise.resolve('p')
const e = () => {
  console.log('e')
  throw new Error('e')
}
const b = (err) => {
  console.log('b')
  return Promise.resolve('b')
}
const c = () => Promise.resolve('c')
const f = (err) => {
  console.log('f')
  return Promise.resolve('f')
}

p.then(e, b).then(c, f).catch(err => {
  console.log('err')
})

/**
 * async await promise 的执行顺序
 */
async function async1(){
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}

async function async2(){
  console.log('async2')
}
console.log('script start')

setTimeout(function(){
  console.log('setTimeout')
}, 0)

async1()

new Promise(function(resolve){
  console.log('promise1')
  resolve()
}).then(function(){
  console.log('promise2')
})
console.log('script end')