// 模块的分类 三大类
// 1. 内置模块 核心模块 fs path http 加载速度是比较高的
let fs = require('fs'); // readFile readFileSync 90多个

// 判断文件是否存在
fs.accessSync('./1.txt'); // 默认是去查找一下，没有就出现异常

let path = require('path');
// resolve join basename extname ....
// 解析就是把相对变成绝对路径
console.log(path.resolve('./2.txt','./','b'));
console.log(path.join(__dirname,'..','/','a','b'));
console.log(__dirname); // 绝对路径
console.log(__filename);

console.log(path.extname('1.a.b.js'));
console.log(path.basename('1.a.b.js','.b.js'));
console.log(path.posix.sep); // 路径分隔符 \  / 
console.log(path.posix.delimiter); // ; :

let vm = require('vm');
let a = 'zfpx';
//vm.runInThisContext(`console.log(a)`); // 沙箱
// let a = 'zfpx';
// eval('console.log(a)'); // eval也是global上的属性
console.dir(global,{showHidden:true})

// 2. 文件模块 我们自己写的 加载速度慢 （同步）
// 自己写的文件

// 3. 第三方模块 安装 可以下载后不需要通过路径直接引用
// npm init -y 先初始化一下 npm install mime
let mime = require('mime'); // 查看类型，第三方模块 需要安装
console.log(mime.getType('js')); 


// 4.通过命令行执行文件

/*
(function(exports,require,module,__dirname,__filename)){
  文件的内容

}()

*/