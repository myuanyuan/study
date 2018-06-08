let fs = require('fs');
let path = require('path');

// 2) promise肯定是异步的 删掉儿子之后删除自己 
function removeDir(dir) {
  return new Promise((resolve, reject) => {
    fs.stat(dir, (err, stat) => {
      if (stat.isDirectory()) {
        fs.readdir(dir, (err, dirs) => { // 读取当前目录下的内容
          dirs = dirs.map(d => path.join(dir, d)); // [b/c,b/d]
          dirs = dirs.map(p => removeDir(p)); // [promise,promise]
          Promise.all(dirs).then(() => {
            fs.rmdir(dir, resolve);
          });
        })
      } else {
        fs.unlink(dir, resolve);// 如果是文件删除后，调用promise的成功
      }
    });
  })
}
removeDir('b').then(data => {
  console.log('成功')
})



// -------------------------------
// 1) 同步删除文件夹 先序深度
// function removeDirSync(dir) {
//   // 删除的时候 你要允许人家删除的不一定是目录
//   let stat = fs.statSync(dir);
//   if(stat.isDirectory()){ // 如果是文件夹读出文件中内容
//     let dirs = fs.readdirSync(dir); 
//     dirs = dirs.map(d=>path.join(dir,d)); // [c/a,c/b];
//     dirs.forEach(d => { // 依次删除子目录 
//       removeDirSync(d);
//     });
//     fs.rmdirSync(dir); // 最后删除自己
//   }else{
//     fs.unlinkSync(dir); // 如果是文件删除跑路即可
//   }
// }
// removeDirSync('d');