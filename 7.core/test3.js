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


girl.emit('发工资', '发了10000工资');                    // 发布
girl.emit('减肥', '要减肥10斤');