// fs fileSystem 文件系统 目录的操作

let fs = require('fs');
// 创建目录 同步方法和异步方法
// 异步不会阻塞主线程 copy
function makep(dir,callback) {
  let dirs = dir.split('/');
  let index = 1;
  function next(index) {
    // 当索引溢出时 就不要递归了
    if(index-1 === dirs.length) return callback();
    let p = dirs.slice(0,index).join('/');
    fs.access(p,(err)=>{
      if(!err){ // 如果没错误，存在的话创建下一个目录
        next(index+1);
      }else{
        // 如果没有这个文件 就会走到err中，创建这个文件，创建完毕后创建下一个文件
        fs.mkdir(p, (err) => {
          if (err) return console.log(err);
          next(index + 1);
        })
      }
    })
  }
  next(index);
}
makep('a/b/c/d/e/f',()=>{ // 创建完执行的函数
  console.log('ok');
});


// 异步不能for循环 function next(){} next()
// function makep(p) { // make -p a/b/c
//   let dirs = p.split('/');
//   for(let i = 0;i<dirs.length;i++){
//     let p = dirs.slice(0,i+1).join('/');
//     try{
//       fs.accessSync(p)
//     }catch(e){
//       fs.mkdirSync(p);
//     }
//   }
// }
// makep('a/b/c/d/e/f');
