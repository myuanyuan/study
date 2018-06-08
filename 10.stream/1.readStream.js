// 流 有序的有方向的 流可以自己控制速率
// 读：读是将内容读取到内存中 
// 写：写是将内存或者文件的内容写入到文件内
let fs = require('fs');
// 读取的时候默认读 默认64k，encoding 读取默认都是buffer
let ReadStream = require('./ReadStream');
let rs = new ReadStream('./2.txt', {
  highWaterMark: 3, // 字节
  flags:'r',
  autoClose:true, // 默认读取完毕后自动关闭
  start:0,
  //end:3,// 流是闭合区间 包start也包end
  encoding:'utf8'
});
// 默认创建一个流 是非流动模式，默认不会读取数据
// 我们需要接收数据 我们要监听data事件，数据会总动的流出来
rs.on('error',function (err) {
  console.log(err)
});
rs.on('open',function () {
  console.log('文件打开了');
});
// 内部会自动的触发这个事件 rs.emit('data');

rs.on('data',function (data) {
  console.log(data);
  rs.pause(); // 暂停触发on('data')事件，将流动模式又转化成了非流动模式
});
setTimeout(()=>{rs.resume()},5000)
rs.on('end',function () {
  console.log('读取完毕了');
});
rs.on('close',function () {
  console.log('关闭')
});