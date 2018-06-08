// 模块分类 
// 核心模块 加载速度快 没有相对路径 fs path
// 第三方模块 需要安装
// 文件模块 相对路径 绝对路径

// 包(需要有一个package.json的文件)的查找，如果文件夹下没有index.js
// let str = require('./a'); // a.js a.json a.node
// console.log(str);
// 如果找文件夹 会找对应的pacakge.json 找到main引用对应的模块


let path = require('path');
let p =  path.resolve(__dirname,'./a.js');
console.log(require(p))
console.log(a);

// // 第三方的模块可以根据node_modules查找
// let mime = require('mime1');
// console.log(mime.getType('.js'));
// // 会不停的向上一级的node_modules查找
// console.log(module.paths);

// 模块的安装
// 全局安装 -g http-server vue-cli 可以在命令行中执行,会放到npm文件夹里
// npm link
// npm install nrm -g 切换源头
// 本地安装
// npm install jquery@1.8.3 
// 开发的时候 安装包有两种 1.开发的时候用gulp webpack
// 上线时需要 react jquery
// 开发上线都需要 
// 只需要上线依赖
// 开发依赖增加--save-dev

// 如果只想安装项目依赖 可以采用npm install --production

// npm发包
// 切换到官方源上
// npm addUser
// npm publish
// 发包成功
