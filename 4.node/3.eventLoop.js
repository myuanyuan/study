// setTimeout和setImmediate顺序是不固定，看node准备时间
// setTimeout(function () {
//   console.log('setTimeout')
// },0);

// setImmediate(function () {
//   console.log('setImmediate')
// });


console.log(1);
setTimeout(()=>{
  console.log('setTimeout1')
},0)
setTimeout(() => {
  console.log('setTimeout2')
}, 0)
Promise.resolve('p').then(()=>console.log('p'));
// nextTick是队列切换时执行的，timer->check队列 timer1->timer2不叫且
setImmediate(() => {
  console.log('setImmediate1')
  setTimeout(() => {
    console.log('setTimeout1')
  }, 0);
})
setTimeout(()=>{
  process.nextTick(()=>console.log('nextTick'))
  console.log('setTimeout2')
  setImmediate(()=>{
    console.log('setImmediate2')
  })
},0);

// poll的下一个阶段时check
// 有check阶段就会走到check中
let fs = require('fs');
fs.readFile('./1.txt',function () {
  setTimeout(() => {
    console.log('setTimeout')
  }, 0);
  setImmediate(() => {
    console.log('setImmediate')
  });
});

// nextTick不要写递归

function Person(){
  // 让特定的值在下一队列中执行，好处时优先级高于timeout
  process.nextTick(()=> {
    this.arr();
  })
}
Person.prototype.eat = function () {
  this.arr = ()=>{console.log('吃')}
}
let p = new Person();
p.eat();

// 我会建立个仓库 1组 xxx.md 掘金地址 2组


// 调试的方式 
