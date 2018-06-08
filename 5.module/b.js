// 什么是commonjs规范
// 定义了如何导入模块 require
// 还定义了如何导出模块 module.exports 导出xxx
// 还定义了一个js就是一个模块
let fs = require('fs');
let path = require('path');
let vm = require('vm');
function Module(p) {
  this.id = p; // 当前模块的标识
  this.exports = {}; // 每个模块都有一个exports属性
  this.loaded = false; // 这个模块默认没有加载完
}
// 所有的加载策略
Module.wrapper = ['(function(exports,require,module){','\n})'];
Module._extensions = {
  '.js': function (module) {
      // 读取js文件 增加一个闭包了
      let script = fs.readFileSync(module.id,'utf8');
      let fn = Module.wrapper[0] + script + Module.wrapper[1];
      vm.runInThisContext(fn).call(module.exports,module.exports,req,module); // exports = 'zfpx'
      return module.exports
  },
  '.json': function (module) {
    return JSON.parse(fs.readFileSync(module.id, 'utf8')); // 读取那个文件
  },
  '.node': 'xxxx'
}
Module._cacheModule = {}// 根据的是绝对路径进行缓存的 
// 解析绝对路径的方法 返回一个绝对路径
Module._resolveFileName = function (moduleId) {
  let p = path.resolve(moduleId);
  // 没有后缀我在加上后缀 如果传过来的有后缀就不用加了
  if (!path.extname(moduleId)) {
    let arr = Object.keys(Module._extensions);
    for (let i = 0; i < arr.length; i++) {
      let file = p + arr[i];
      try {
        fs.accessSync(file);
        return file;
      } catch (e) {
        console.log(e);
      }
    }
  } else {
    return p;
  }
}
// 模块加载的方法
Module.prototype.load = function (filepath) {
  // 判断加载的文件是json还是node或者是js
  let ext = path.extname(filepath); // js
  let content = Module._extensions[ext](this); // content就是json的内容
  return content
}
function req(moduleId) {
  let p = Module._resolveFileName(moduleId);// p是一个绝对路径
  if (Module._cacheModule[p]) {
    // 模块不存在,如果有直接把exports对象返回即可
    return Module._cacheModule[p].exports;
  }
  let module = new Module(p); // 表示没有缓存就生成一个模块
  // 加载模块
  let content = module.load(p); // 加载模块
  Module._cacheModule[p] = module;
  module.exports = content; //module.exports = {name:'zfpx'};
  return module.exports
}
let a = req('./a.js');
req('./a.js');
console.log(a);
// 1.模块的加载过程
// 1) a文件夹下 有一个a.js  b文件夹下也有a.js 解析出一个绝对路径来
// 2）我们写的路径可能没有后缀名 .js .json .node
// 3)得到一个真实的加载路径（模块会缓存） 先去缓存中看一下这个文件是否存在，如果有返回缓存 没有创建一个模块
// 4）得到对应文件的内容，加一个闭包，把内容塞进去，之后执行即可


