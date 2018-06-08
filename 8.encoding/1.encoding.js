// ASCII 0-127 (26个字母 特殊符号)
// GB2312
// GB18030
// utf8

// 8个位都是1 = 一个字节最大是多少 = 10进制的 255

// 进制转换的问题
console.log(parseInt('11111111', 2));
// 其他进制的转化 16进制转化成10进制
// 2进制 0b开头
// 8进制 0o
// 10进制
// 16进制 0x

console.log((278).toString(16)); //  将10进制转化成任意进制
// 单字节 小于127的 大于127我认为是汉字和双子节


// 0x73E0   29664 珠
//UTF8汉字的规则
//1110xxxx 10xxxxxx 10xxxxxx
//     111   001111   100000
console.log((29664).toString(2));

// 将unicode编码 转化程utf8格式，utf8

function transfer(r) {
  let  code = [1110,10,10];
  code[2] +=(r).toString(2).slice(-6);
  code[1] += (r).toString(2).slice(- 12, - 6);
  code[0] += ((r).toString(2).slice(0, -12)).padStart(4,0);
  code = code.map(item=>parseInt(item,2));
  console.log(Buffer.from(code).toString());
}
transfer(0x73E0)

console.log((49578).toString(2));
//11000001 10101010

// base64 转化 并不是加密，只是编码转化