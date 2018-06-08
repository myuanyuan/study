废话就不多说了，这篇文章就不再聊关于promise的各种好处和用法了，如果不了解请自行Google啦！

我相信很多人在面试的时候遇到过这样一道面试题：
```
console.log(0)
let p = Promise.resolve()
setTimeout(()=>{
    console.log(4);
    setTimeout(()=>{
        console.log(5);
    },0);
},0);
p.then(data=>{
    console.log(2);
    setTimeout(()=>{
        console.log(3);
    },0);
})
console.log(6)
```
那么你的答案是什么呢？
粘贴到chrome的控制台里运行一下，结果如下
```
// 0
// 6
// 2
// 4
// 3
// 5
```
interesting的是，并不是在所有浏览器里都是这样的打印顺序的，例如，在safari 9.1.2中测试，输出却这样的：
```
// 0
// 6
// 4
// 2
// 5
// 3
```
再放到safari 10.0.1中却又得到了和chrome一样的结果；

当然，这只是这道面试题的一个简单版本哟！

那么这道题到底在考察什么呢？

其实，我相信很多同学都可以一眼看出0和6会先输出，但是setTimeout和promise哪个先执行就有一丢丢小纠结了

再也不想为这样的执行顺序所困扰？让我们先来了解一下js的event loop机制和promises的实现原理吧。

我们都知道promise是用来处理异步的，也知道js是单线程的，那么js的异步是什么呢？
这里我们先明确一批概念，是的没看错，一批
#### js 
ECMAScript + DOM + BOM
我们说js异步背后的“靠山”就是event loops。
其实这里的异步准确的说应该叫浏览器的event loops或者说是javaScript运行环境的event loops，因为ECMAScript中没有event loops，
event loops是在HTML Standard定义的。

#### event loop
event loop也就是我们常说的事件循环，可以理解为实现异步的一种方式，我们来看看event loop在HTML Standard中的定义：
> 为了协调事件，用户交互，脚本，渲染，网络等，用户代理必须使用本节所述的event loop。

#### 进程和线程
我们知道javascript在最初设计时设计成了单线程,为什么不是多线程呢？
进程是操作系统分配资源和调度任务的基本单位,线程是建立在进程上的一次程序运行单位，一个进程上可以有多个线程。

以浏览器为例
1. 用户界面-包括地址栏、前进/后退按钮、书签菜单等
2. 浏览器引擎-在用户界面和呈现引擎之间传送指令(浏览器的主进程)
3. 渲染引擎，也被称为浏览器内核(浏览器渲染进程)
4. 一个插件对应一个进程(第三方插件进程)
5. GPU提高网页浏览的体验(GPU进程)

由此可见浏览器是多进程的,并且从我们的角度来看我们更加关心主进程，也就是浏览器渲染引擎

而单独看渲染引擎，内部又是多线程的,包含两个最为重要的线程，即ui线程和js线程。而且ui线程和js线程是互斥的,因为JS运行结果会影响到ui线程的结果。

这里也就回答了javascript为什么是单线程得问题，试想一下，如果多个线程同时操作DOM那岂不会很混乱？

当然，这里所谓的单线程指的是主线程，也就是渲染引擎是单线程的,同样的，在Node中主线程也是单线程的。

既然说js单线程指的是主线程是单线程的，那么还有哪些其他的线程呢？

1. 浏览器事件触发线程(用来控制事件循环,存放setTimeout、浏览器事件、ajax的回调函数)
2. 定时触发器线程(setTimeout定时器所在线程)
3. 异步HTTP请求线程(ajax请求线程)

#### 其他线程
单线程特点是节约了内存,并且不需要在切换执行上下文。而且单线程不需要管其他语言如java里锁的问题；

ps：这里简单说下锁的概念。例如下课了大家都要去上厕所,厕所就一个,相当于所有人都要访问同一个资源。那么先进去的就要上锁。而对于node来说。
下课了就一个人去厕所,所以免除了锁的问题！

#### task （macrotask）

一个event loop有一个或者多个task队列。

当用户代理安排一个任务，必须将该任务增加到相应的event loop的一个tsak队列中。

每一个task都来源于指定的任务源，比如可以为鼠标、键盘事件提供一个task队列，其他事件又是一个单独的队列。可以为鼠标、键盘事件分配更多的时间，保证交互的流畅。

task也被称为macrotask，task队列还是比较好理解的，就是一个先进先出的队列，由指定的任务源去提供任务。

哪些是task任务源呢？

规范在Generic task sources中有提及：

> DOM操作任务源：
此任务源被用来相应dom操作，例如一个元素以非阻塞的方式插入文档。

> 用户交互任务源：
此任务源用于对用户交互作出反应，例如键盘或鼠标输入。响应用户操作的事件（例如click）必须使用task队列。

> 网络任务源：
网络任务源被用来响应网络活动。

> history traversal任务源：
当调用history.back()等类似的api时，将任务插进task队列。

总之，task任务源非常宽泛，比如ajax的onload，click事件，基本上我们经常绑定的各种事件都是task任务源，还有数据库操作（IndexedDB ），需要注意的是setTimeout、setInterval、setImmediate也是task任务源。总结来说task任务源：

1. setTimeout
2. setInterval
3. setImmediate  （这是什么东东？没用过吧？没用过很正常，因为它只兼容ie）
4. MessageChannel
5. I/O
6. UI rendering

#### microtask

每一个event loop都有一个microtask队列，一个microtask会被排进microtask队列而不是task队列。

有两种microtasks：分别是solitary callback microtasks和compound microtasks。规范值只覆盖solitary callback microtasks。

如果在初期执行时，spin the event loop，microtasks有可能被移动到常规的task队列，在这种情况下，microtasks任务源会被task任务源所用。通常情况，task任务源和microtasks是不相关的。

microtask 队列和task 队列有些相似，都是先进先出的队列，由指定的任务源去提供任务，不同的是一个
event loop里只有一个microtask 队列。

HTML Standard没有具体指明哪些是microtask任务源，通常认为是microtask任务源有：

1. process.nextTick
2. promises.then
3. Object.observe
4. MutationObserver


#### 执行栈
task和microtask都是推入栈中执行的
来看下面一段代码：
```
  function bar() {
    console.log('bar');
  }

  function foo() {
    console.log('foo');
    bar();
  }

  foo();
```
<div  align="center">
  <img src="https://user-gold-cdn.xitu.io/2018/5/15/16362c26be674003?w=3044&h=1664&f=jpeg&s=170566"  alt="" align=center />
</div>

在规范的Processing model定义了event loop的循环过程：
一个event loop只要存在，就会不断执行下边的步骤：
1. 在tasks队列中选择最老的一个task,用户代理可以选择任何task队列，如果没有可选的任务，则跳到下边的microtasks步骤。
2. 将上边选择的task设置为正在运行的task。
3. Run: 运行被选择的task。
4. 将event loop的currently running task变为null。
5. 从task队列里移除前边运行的task。
6. Microtasks: 执行microtasks任务检查点。（也就是执行microtasks队列里的任务）
7. 更新渲染（Update the rendering）...
8. 如果这是一个worker event loop，但是没有任务在task队列中，并且WorkerGlobalScope对象的closing标识为true，则销毁event loop，中止这些步骤，然后进行定义在Web workers章节的run a worker。
9. 返回到1

主线程之外，还存在一个任务队列，用来放置microtask。
<div  align="center">
  <img src=" https://user-gold-cdn.xitu.io/2018/5/15/16362c52da7420f5?w=601&h=527&f=png&s=23607"  alt="" align=center />
</div>

简单来说，event loop会不断循环的去取tasks队列的中最老的一个任务推入栈中执行，当次循环同步任务执行结束之后检查是否存在microtasks队列，如果有microtasks则先执行microtasks，执行结束清空microtasks栈，把下一个task放入执行栈内，如此循环。


说了这么多关于event loop的东西，好像跟开篇的面试题并没有什么关系啊？

别着急，下面我们聊一下promise的实现；
我们知道，promise是属于es6的，在以前浏览器并不支持，也就衍生了各家诸如bluebird，q，when等promise库，这些promise库的实现方式不尽相同，但都遵循Promises/A+规范；

其中2.2.4就是：
>  onFulfilled or onRejected must not be called until the execution context stack contains only platform code. [3.1].

这就意味着，在实现promise时，onFulfilled和onRejected要在新的执行上下文里才能执行；

而在3.1中提及了
> This can be implemented with either a “macro-task” mechanism such as setTimeout or setImmediate, or with a “micro-task” mechanism such as MutationObserver or process.nextTick.

即promise的then方法可以采用“宏任务（macro-task）”机制或者“微任务（micro-task）”机制来实现。有的浏览器将then放入了macro-task队列，有的放入了micro-task 队列。开头打印顺序不同也正是源于此，不过一个普遍的共识是promises属于microtasks队列。

那么我们就来简单看一下promise的“宏任务（macro-task）”机制实现：
```
class Promise {
  constructor(executor) {
    this.status = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    let resolve = (data) => {
      if (this.status === 'pending') {
        this.value = data;
        this.status = 'resolved';
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    }
    let reject = (reason) => {
      if (this.status === 'pending') {
        this.reason = reason;
        this.status = 'rejected';
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    }
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  then(onFulFilled, onRejected) {
    onFulFilled = typeof onFulFilled === 'function' ? onFulFilled : y => y;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err; };
    let promise2;
    if (this.status === 'resolved') {
      promise2 = new Promise((resolve, reject) => {
        setTimeout(() => {  //“宏任务（macro-task）”机制实现
          try {
            let x = onFulFilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      });
    }
    if (this.status === 'rejected') {
      promise2 = new Promise((resolve, reject) => {
        setTimeout(() => {  //“宏任务（macro-task）”机制实现
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e);
          }
        }, 0);
      });
    }
    if (this.status === 'pending') {
      promise2 = new Promise((resolve, reject) => {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulFilled(this.value);
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e);
            }
          }, 0)
        });
        // 存放失败的回调
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      })
    }
    return promise2; // 调用then后返回一个新的promise
  }
  // catch接收的参数 只用错误
  catch(onRejected) {
    // catch就是then的没有成功的简写
    return this.then(null, onRejected);
  }
}
```

没错我们看到了setTimeout；
这种就是通过macro-task机制实现的，打印出来的顺序就是如在safari 9.1.2中一样了。
测试了一下bluebird的promise的实现，输出的结果又和上面的都不一样：
```
// 0
// 6
// 4
// 2
// 5
// 3
```
所以到底哪个先输出，要看你所使用的promise的实现方式；

当然正如上面提到的一个普遍的共识是promises属于microtasks队列，所以一般情况下，promise.then并不是上面的这种实现，而是mic-task机制；

那么再来看开篇的题目
```
console.log(0)      // 同步
let p = Promise.resolve();
setTimeout(()=>{    // 异步 macrotask
    console.log(4);
    setTimeout(()=>{
        console.log(5); // 异步 macrotask
    },0);
},0);
p.then(data=>{      // 异步 (通过macro-task实现则为macrotask，通过micro-task实现则为microtask)
    console.log(2);
    setTimeout(()=>{      // 异步 macrotask
        console.log(3);
    },0);
})
console.log(6)  // 同步
```
这样就很清晰了对吧

上面有列出microtask有
1. process.nextTick
2. promises
3. Object.observe
4. MutationObserver

不知道用过vue1.0的同学有没有了解过vue1.0的nextTick是如何实现的呢？ 

有兴趣可以看一下源码，就是通过MutationObserver实现的，只是因为兼容问题已经被取代了；

没用过MutationObserver？没关系，我们举一个简单的例子
假如我们要往一个id为parent的dom中添加元素，我们期望所有的添加操作都完成才执行我们的回调
如下
```
    let observe = new MutationObserver(function () {
          console.log('dom全部塞进去了');
    });
    // 一个微任务
    observe.observe(parent,{childList:true});
    for (let i = 0; i < 100; i++) {
      let p = document.createElement('p');
      div.appendChild(p);
    }
    console.log(1);
    let img = document.createElement('p');
    div.appendChild(img);
```
That's all ,如上；

#### references

[从event loop规范探究javaScript异步及浏览器更新渲染时机](https://github.com/aooy/blog/issues/5)

[Promises/A+](https://promisesaplus.com/)

[webappapis](https://html.spec.whatwg.org/multipage/webappapis.html)
