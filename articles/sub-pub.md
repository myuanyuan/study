### 发布订阅
很多人javascript设计模式看了n遍，从不太理解到理解，再到每次看都了然于胸一天之后就忘得干干净净，其实应用起来或者写下来，也许你会理解得更彻底一些；

上代码吧
```javascript
let event = {                                                   // event 事件对象
    list: {},                                                   // event绑定的事件订阅列表
    on(key, fn) {                                               // 添加事件绑定   key表示要添加绑定的事件类型
        if (!this.list[key]) {                                  // 如果没有则创建空数组
            this.list[key] = [];
        }
        this.list[key].push(fn);                                // push进该类型事件数组
    },
    emit() {
        let key = [].shift.call(arguments),     //发布 取key值为emit的第一个参数
            fns = this.list[key];
        if (!fns || fns.length === 0) {         // 如果该事件订阅列表为空 返回false 这里不进行其他处理
            return false;
        }                                       // 如果该事件订阅列表存在，则依次执行
        fns.forEach(fn => {                       
            fn.apply(this, arguments);          // 这里的arguments已经删除了key值
        });
    },
    remove(key, fn) {                           // 取消订阅
        let fns = this.list[key];         
        if (!fns) return false;                 // 如果缓存列表中没有函数，返回false
        if (!fn) {                              // 如果没有传对应函数的话 就将key值对应缓存列表中的函数都清空掉
            fns && (fns.length = 0);
        } else {                                // 遍历缓存列表，看看传入的fn与哪个函数相同，如果相同就直接从缓存列表中删掉即可
            fns.forEach((cb, i) => {
                if (cb === fn) {
                    fns.splice(i, 1);
                }
            });
        }
    }
};
// 测试
function cat(data) {
    console.log(data, '喵喵喵');
}
function dog(data) {
    console.log(data, '旺旺旺');
}
function animal(data) {
    console.log(data, '都是主子');
}
function pet(data) {
    console.log(data, '都是动物');
}
event.on('animal',animal);
event.on('animal', pet);
event.on('cat', cat);
event.on('dog', dog);
// 发布
event.emit('animal', ['藏獒', '波斯猫']);
event.emit('cat', ['波斯猫']);
event.emit('dog', ['藏獒']);
// 取消dog方法的订阅
event.remove('animal', pet);
// 再次发布
event.emit('animal', ['藏獒', '波斯猫']);
``` 
很清晰了，接下来再聊一聊node的一个模块events吧

#### node 的 events模块的应用

```javascript
// 监听的目的 就是为了构造这样一个对象 一对多的关系    on
// 发布的时候 会让数组的函数依次执行                emit
let EventEmitter = require('events');               // 引入events模块
class Girl extends EventEmitter{}                   // class继承
let girl = new Girl();                              // new 一个Girl的实例
let shopping = function (data) {                    // 购物
    console.log(data, '去购物');
};
let dieting = function (data) {                      // 节食
    console.log(data, '去节食');
};
girl.on('newListener', function (eventName) {        // 添加订阅的监听
    console.log('新添加了订阅： ' + eventName);
});
girl.setMaxListeners(3);                               // 设置最大订阅数
console.log('最大订阅数是：', girl.getMaxListeners());   // 打印最大订阅数
girl.on('减肥', dieting);                              // 订阅减肥 
girl.once('发工资', shopping);                         // 订阅发工资
girl.prependListener('发工资', function () {    
    console.log('这是发工资前');
});
```
当然这里是使用node的模块，那如果我想自己去实现一个这样的event模块呢

#### node 的 events模块的实现

上代码
 ```javascript
  function EventEmitter() {
      // this._events = {};
      // 用Object.create(null)代替空对象{}的好处是无杂质，不继承原型链
      this._events = Object.create(null);
  }
  // 默认最多的绑定次数
  EventEmitter.defaultMaxListeners = 10;
  // 同on方法
  EventEmitter.prototype.addListener = EventEmitter.prototype.on;
  // 返回监听的事件名
  EventEmitter.prototype.eventNames = function () {
      return Object.keys(this._events);
  };
  // 设置最大监听数
  EventEmitter.prototype.setMaxListeners = function (n) {
      this._count = n;
  };
  // 返回监听数
  EventEmitter.prototype.getMaxListeners = function () {
      return this._count ? this._count : this.defaultMaxListeners;
  };
  // 监听
  EventEmitter.prototype.on = function (type, cb, flag) {
      // 默认值，如果没有_events的话，就给它创建一个
      if (!this._events) {
          this._events = Object.create(null);
      }
      // 不是newListener 就应该让newListener执行以下
      if (type !== 'newListener') {
          this._events['newListener'] && this._events['newListener'].forEach(listener => {
              listener(type);
          });
      }
      if (this._events[type]) {
          // 根据传入的flag来决定是向前还是向后添加
          if (flag) {
              this._events[type].unshift(cb);
          } else {
              this._events[type].push(cb);
          }
      } else {
          this._events[type] = [cb];

  }
      // 监听的事件不能超过了设置的最大监听数
      if (this._events[type].length === this.getMaxListeners()) {
          console.warn('警告-警告-警告');
      }
  };
  // 向前添加
  EventEmitter.prototype.prependListener = function (type, cb) {
      this.on(type, cb, true);
  };
  EventEmitter.prototype.prependOnceListener = function (type, cb) {
      this.once(type, cb, true);
  };
  // 监听一次
  EventEmitter.prototype.once = function (type, cb, flag) {
      // 先绑定，调用后删除
      function wrap() {
          cb(...arguments);
          this.removeListener(type, wrap);
      }
      // 自定义属性
      wrap.listen = cb;
      this.on(type, wrap, flag);
  };
  // 删除监听类型
  EventEmitter.prototype.removeListener = function (type, cb) {
      if (this._events[type]) {
          this._events[type] = this._events[type].filter(listener => {
              return cb !== listener && cb !== listener.listen;
          });
      }
  };
  EventEmitter.prototype.removeAllListener = function () {
      this._events = Object.create(null);
  };
  // 返回所有的监听类型
  EventEmitter.prototype.listeners = function (type) {
      return this._events[type];
  };
  // 发布
  EventEmitter.prototype.emit = function (type, ...args) {
      if (this._events[type]) {
          this._events[type].forEach(listener => {
              listener.call(this, ...args);

      });
  }
};

module.exports = EventEmitter;
 ```

 现在可以通过引入我们自己实现的event来进行测试了

 ```javascript
//  let EventEmitter = require('events');               // 引入events模块
 let EventEmitter = require('./events');               // 引入events模块
 ```
 That's all，如上；

 