let {inherits, promisify}= require('util');
// let fs = require('fs');
// let read = promisify(fs.readFile);

// koa 都是采用async和await实现的
// async function r() {
//   try{
//     let result = await read('3.txt', 'utf8');
//     return result;
//   }catch(e){
//     throw e
//   }
// }
// r().then(data=>{
//   console.log(data);
// },err=>{
//   console.log(err);
// });


// 继承
function A() {
  
}
A.prototype.a = '1'
function B() {
  
}
B.prototype = Object.create(A.prototype);
B.prototype.__proto__ = A.prototype;
Object.setPrototypeOf(B.prototype,A.prototype);
inherits(B, A); // 只继承公有的方法
let b = new B();
console.log(b.a);