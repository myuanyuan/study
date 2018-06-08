
简单聊下js异步的发展历程，这里只简单聊用法

模拟一个简单需求：在1000毫秒之后执行某个操作
#### 阶段1 ：callback实现
```
const foo=(callback)=>{
    setTimeout(()={
        callback();
    },1000)
}
```
当然我们知道，当在1000毫秒之后执行的某个操作也是这样一个异步的时候，地狱式回调就开始了；

#### 阶段2： promise实现

```
let p = new Promise((resolve,reject)=>{
  setTimeout(()=>{
    resolve();
  },1000)
});
p.then(data=>{
    // 某个操作
})
```
这个时候，如果某个操作也是一个异步，我们就可以通过promise的链式处理,如下
```
let p = new Promise((resolve,reject)=>{
  setTimeout(()=>{
    resolve();
  },1000)
});
p.then(data=>{
    // 某个操作1
}).then(data=>{
    // 某个操作2
}).then(data=>{
    // 某个操作3
}).catch(err=>{
    // 错误捕捉
})
```
#### 阶段3 ：generator实现

```
// * 和 yield一起使用，yield产出
function * gen() {     // 可以暂停，调用next才会继续走
  let a = yield '买菜'; // a的结果某个操作1的返回值
  let b = yield a;     // b的结果是的结果某个操作2的返回值
  return b;            // 返回某个操作2的返回值
}
let a = gen();          // 执行后返回的是迭代器
console.log(a.next());
console.log(a.next());
```

这里有个小插曲：有一天微信群里有人人关于generator的问题，一个大佬说不用学generator了，已经被废弃了，以后都用async的。吓得我赶紧去官网查了查，这里注意一下，async+await 是generator的语法糖，generator并不是被废弃了，只是有更方便的方式给我们用，为什么不呢？

#### 阶段4 ：async实现

1. async返回的结果是一个promise
2. await后面只能跟着promise


```
function move(ele, position) {            // move用来移动dom
  return new Promise((resolve, reject) => {
    let left = 0;
    let timer = setInterval(() => {       // timer是一个用来移动dom的定时器
      left += 5;
      if (left >= position) {
        clearInterval(timer);
        ele.style.transform = `translateX(${position}px)`;
        resolve();
      } else {
        ele.style.transform = `translateX(${left}px)`;
      }
    }, 15);
  })
}

async function m() {
  await move(ball1, 100);
  await move(ball2, 100);
  await move(ball3, 100);
}
m().then(data=>{
  alert('ok');
});
```
看起来是不是和同步代码很像了呢

That's all

如上；