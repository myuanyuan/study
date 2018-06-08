// 带路径的都是自己写的模块
// 不带路径可能是node自带的还有可能是第三方的
let str = require('./1.js');
console.log(str);
// module,exports,require 全局属性，不是定义在global上的但是可以直接使用

// 1.模块引用时会找到绝对路径
// 2.模块加载过会有缓存，有缓存直接拿出来用
// 3.缓存中存放的是路径和 模块
// 4.node实现模块化就是增加了一个闭包 加上一个自执行
// (function (exports, require, module, __filename, __dirname) {
//   文件的内容
// })