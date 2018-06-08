// global全局对象
// 全局属性
// console
// process.stdout
// 标准输出代号1
console.log('log');
console.info('info');
// 错误输出代号2
console.error('error');
console.warn('warn');

// 算服务器的请求时间
console.time('a');
console.timeEnd('a');
// 断言 node中自带了一个模块 这个模块就叫assert();
// console.assert((1+1)==3,'hello');
// 显示隐藏属性
// console.dir(Array.prototype,{showHidden:true});

// 2）执行时的参数 (args库)
console.log(process.argv); // 后期 写命令行工具原理
let args = {};
process.argv.slice(2).forEach((item,idx)=>{
  if(item.includes('--')){
    args[item] = process.argv.slice(2)[idx+1];
  }
})
console.log(args);

// 3）环境变量 (判断是开发环境还是线上环境);
// mac export windows set 可以根据环境变量打出对应的url
let url;
if(process.env.NODE_ENV==='development'){
  url = 'http://localhost:3000/api'
}else{
  url = 'http://zfpx.cn'
}
console.log(url);

// 4）目录的更改问题
process.chdir('..'); // 更改当前的工作目录
console.log(process.cwd());

// 监听标注输入
process.stdin.on('data',function (data) {
    process.stdout.write(data.toString());
});

// process.nextTick 微任务，和promise中的then比 nextTick快
// console.log(1);
// Promise.resolve('123').then(()=>{console.log('then')})
// process.nextTick(function () {
//   console.log('nextTick')
// })
// console.log(2);

// process 进程
  // argv 执行时的参数
  // env 环境变量
  // pid 编号
  // chdir change directory 改变文件夹
  // cwd current working directory 读取文件夹中的内容
  // stdout 标准输出 stderr 错误输出 stdin 标准输入
// exit 退出进程 kill
// Buffer 二进制缓存
//setImmediate 宏任务
//setTimeout
//setInterval

console.log('ok');
setImmediate(()=>{
  console.log('setImmediate')
})
console.log('no');

// 文件中还增加了几个全局属性....
