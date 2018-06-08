// fs 基础的用法 api
// fs.readFile
let fs = require('fs');
// error-first 错误第一
// fs.readFile('./1.txt',{encoding:'utf8',flag:'r',},function (err,data) {
//   if(err) return console.log(err);
//   console.log(data);
// });
// fs.writeFile
// 文件中存的永远是二进制 0o666 标识可读 可写
// fs.writeFile('./2.txt',Buffer.from('123'),{flag:'a',mode:0o666},function () {
//   console.log('写入成功')
// })
// fs.copyFile
// fs.copyFile('1.txt','3.txt',function () {
//   console.log('拷贝成功')
// });

// 如果要实现拷贝大文件 以上的操作都会造成内存过大情况
// fs.read
// fd 代表的是文件描述符 符号是从3开始
// 0 代表的是标准输入
// 1 标准输出 process.stdout
// 2 代表的是错误输出 process.stderr
// fs.open('./1.txt','r',function (err,fd) {
//   // 把文件中的内容读取到内存中
//   let BUFFER_SIZE = 3
//   let buffer = Buffer.alloc(BUFFER_SIZE);
//   // fd藐视符 buffer是读取到哪个buffer上 offsetbuffer的偏移量
//   // byteRead实际读到的个数
//   let index = 0;
//   function next() {
//     // 每次读取三个 ，如果读取的等于三个默认认为还有数据 ，否则就认为读取完毕了
//     fs.read(fd, buffer, 0, BUFFER_SIZE, index, function (err, byteRead) {
//       index+=byteRead
//       console.log(buffer.slice(0,byteRead).toString());
//       if (byteRead === BUFFER_SIZE){
//         next();
//       }else{
//         fs.close(fd,()=>{console.log('close')});
//       }
//     })
//   }
//   next();
// });

// 节约内存的copy 流 pipe ***
function copy(source,target){
  let BUFFER_SIZE = 3;
  let buffer = Buffer.alloc(BUFFER_SIZE);
  let index = 0;
  fs.open(source,'r',function (err,rfd) { // 开启读取的文件描述符
    if(err) return console.log(err);
    fs.open(target, 'w', 0o666, function (err, wfd) { // 开启写入的文件描述符
      function next() {
        fs.read(rfd, buffer, 0, BUFFER_SIZE, index, function (err, bytesRead) {
          // 要写入的文件描述符 写入的buffer buffer的偏移量，buffer写入的个数，文件的位置
          fs.write(wfd, buffer, 0, bytesRead, index, function (err, byteWritten) {
            index += bytesRead;
            if (byteWritten){ // 如果有写入的内容，就继续读取
              next();
            }else{
              fs.close(rfd,()=>{});
              // 把内存中的内容 强制写入后再关闭文件(写入的操作是异步操作)
              fs.fsync(function () {
                fs.close(wfd, () => { })
              })
            }
          });
        })
      }
      next();
    })
  })
}
copy('1.txt','5.txt')






// fs.write
// fs.open
// fs.sync
// fs.close

// fs.mkdir
// fs.rmdir
// fs.rname
// fs.readdir
// ......

// 二爷一直死读书
