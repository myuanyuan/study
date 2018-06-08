let str = require('./a');
console.log(str);
// 1.模块是有缓存的

// 2.模块中的this 是module.exports属性

// 3.模块定义的变量不能互相引用

// module.exports  exports  exports是module.exports的别名

// 模块默认返回的是module.exports 并不是exports