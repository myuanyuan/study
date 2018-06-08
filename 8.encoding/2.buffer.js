// Buffer 
// 在node中操作文件都是2进制的操作
// 声明一段内存 有两个方法 Buffer.from Buffer.alloc

// 二进制特点 长
// buffer中把二进制转化成16进制展示
// 非配内存的大小不能更改，v8 1.7g
// 引用类型 非常像二维数组
// buffer的声明
// allocUnsafe速度快 但是不安全

//1)通过长度创建
let buffer = Buffer.alloc(6); // 安全，速度会慢
console.log(buffer);
//2) 通过数组创建一般都要合法传递 0-255
let buffer = Buffer.from([1,2,3]);
console.log(buffer);
//3）用字符串创建 (node不支持gb2312) 有人写好了转换的包
let buffer = Buffer.from('珠峰');
console.log(buffer);

// 4) 编码转化的问题
let fs = require('fs');
let path = require('path');
let iconvLite = require('iconv-lite'); // 这个包需要转化的是buffer
let r = fs.readFileSync(path.resolve(__dirname,'a.txt'));
let result = iconvLite.decode(r,'gbk'); // 进行内容编码的转化
console.log(result); 

// 5）BOM头的问题 gb2312 另存为utf8 会出现BOM头
let fs = require('fs');
let a = require('./1.encoding')
let path = require('path');
function stripBom(buffer){
  if (Buffer.isBuffer(buffer)){
    if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
      return buffer.slice(3)
    }
  }else{
    if (buffer.charCodeAt(0) === 0xFEFF){
      return buffer.slice(1);
    }
  }
  return buffer
}
let iconvLite = require('iconv-lite'); // 这个包需要转化的是buffer
let r = stripBom(fs.readFileSync(path.resolve(__dirname, 'a.txt'),'utf8'));
console.log(r.toString());


// 6) buffer可以和字符串进行转化

// 如果不能拼成汉字 需要对不能输出的进行缓存
let buffer = Buffer.from('珠峰'); 
let a = buffer.slice(0, 2);
let b = buffer.slice(2, 6);
let {StringDecoder} = require('string_decoder');
let sd = new StringDecoder();
console.log(sd.write(a)); //  此时不是正常汉字 则保存在sd的内部
console.log(sd.write(b))// 下次输出时会把上次的结果一同输出

// Buffer.alloc Buffer.from slice [] Buffer.isBuffer()

// Buffer.copy() Buffer.concat()

//7) copy方法
let buffer1 = Buffer.alloc(6);
let buffer2 = Buffer.from('珠峰');
// 目标buffer  目标开始的拷贝位置  源的开思和结束位置
Buffer.prototype.mycopy = function (target,targetStart,sourceStart,sourceEnd) {
  for (var i = 0; i < sourceEnd - sourceStart;i++){
    target[i + targetStart] = this[sourceStart+i];
  }
}
buffer2.mycopy(buffer1,1,3,6);
console.log(buffer1.toString())
// for(var i = 0;i<buffer2.length;i++){
//   buffer1[i] = buffer2[i];
// }
// console.log(buffer1.toString());


// 8) concat();

let buffer1 = Buffer.from('珠')
let buffer2 = Buffer.from('峰');
let buffer3 = Buffer.from('峰');
Buffer.concat = function (list,len) {
  if(typeof len === 'undefined'){ // 求拷贝后的长度
    len = list.reduce((current,next,index)=>{
      return current+next.length;
    },0);
  }
  let newBuffer = Buffer.alloc(len); // 申请buffer
  let index = 0;
  list.forEach(buffer =>{ // 将buffer一一拷贝
    buffer.copy(newBuffer, index);
    index+=buffer.length;
  });
  return newBuffer.slice(0,index); // 返回拷贝后的buffer
}
// 接收请求时会采用concat方法进行拼接
console.log(Buffer.concat([buffer1, buffer2, buffer3],10).toString());


// 9)buffer.indexof(); 内置的
let b = Buffer.from([1,2,3,4,1,2,3,4]);
console.log(b.indexOf(2,4));


let buffer = Buffer.from('珠峰**珠峰**珠峰'); // split
Buffer.prototype.split = function (sep) {
  let index = 0;
  let len = Buffer.from(sep).length;
  let i = 0;
  let arr = [];
  while (-1 !== (i=this.indexOf(sep, index))) {
    let a = this.slice(index,i);
    index = i+len
    arr.push(a);
  }
  arr.push(this.slice(index));
  return arr.map(item=>item.toString());
}
let arr = buffer.split('**'); // [<Buffer 珠峰>,<Buffer 珠峰>,<Buffer 珠峰>]
console.log(arr); // buffer的split方法