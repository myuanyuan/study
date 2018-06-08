let fs = require('fs');
let path = require('path');


// 2) 广度
function preWide(dir) {
  let arr = [dir];
  let index = 0;
  while (arr[index]) {
    let current = arr[index++];
    let stat = fs.statSync(current);
    if (stat.isDirectory()) {
      let dirs = fs.readdirSync(current);
      arr = [...arr, ...dirs.map(d => path.join(current, d))];
    }
  }
  // 倒着删除
  for (var i = arr.length-1; i >= 0; i--) {
    let p = arr[i];
    let stat = fs.statSync(p);
    if (stat.isDirectory()) {
      fs.rmdirSync(p)
    } else {
      fs.unlinkSync(p);
    }
  }
}
//preWide('a');
// 今天作业：写一个广度异步删除
// 改名字
// fs.renameSync('1.txt','66.txt');
// 截断
// fs.truncateSync('./2.txt',3);

// gulp 用它监控文件的变化
fs.watchFile('2.txt',function (current,prev) {
  if (Date.parse(prev.ctime) ==0 ){
    console.log('创建');
  } else if (Date.parse(current.ctime) ==0){
    console.log('删除')
  }else{
    console.log('修改')
  }
});





// 1).先序深度优先遍历删除
// function rmdir(dir,callback) {
//   fs.stat(dir,(err,stat)=>{
//     if(stat.isDirectory()){ // 是目录的话？
//       fs.readdir(dir,(err,dirs)=>{
//         // 只要涉及到异步递归就用next
//         // a/b 是没有内容的
//         function next(index) {
//           if ((dirs.length === 0) || (index === dirs.length)){
//             return fs.rmdir(dir, callback)
//           }
//           let p = path.join(dir,dirs[index]); // a/b;
//           rmdir(p,()=>next(index+1)); // 当删除a/b 就应该删除a/c;
//         }
//         next(0);
//       });
//     }else{
//       fs.unlink(dir,callback);
//     }
//   })
// }

// rmdir('a',()=>{
//   console.log('delete ok')
// })