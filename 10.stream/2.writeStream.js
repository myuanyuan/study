let fs = require('fs');
// 创建一个可写流
// 可写流没有会创建 有内容的话会清空 w
// 读取时 读到三个就发射出来
// 读取了30个 写一次能写3个
// 第一次是真的往文件里写，后面的都会放到缓存区中，过一会写完了，会去清空缓存区
let ws = fs.createWriteStream('2.txt',{
  flags:'w',
  encoding:'utf8',
  start:0,
  highWaterMark:1 // 写是16k
});
let flag = ws.write(1+''); //写入的内容必须是buffer或者string，写是异步的方法
console.log(flag);
flag = ws.write(1 + '');
console.log(flag);
flag = ws.write(1 + '');
console.log(flag);
flag = ws.write(1 + '');
console.log(flag);
// flag表示当前是否满了
// 可读流一般配合可写流 ，如果都吃不下了，这个属性为了保证读取和写入可以节约内存，而不是疯狂的读
