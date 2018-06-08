let fs = require('fs');
let ws = fs.createWriteStream('2.txt',{
  flags:'w',
  encoding:'utf8',
  start:0,
  highWaterMark:3 // 一次能写三个
});
let i = 9;
function write() {
  let flag = true; // 表示是否能写入
  while (flag&&i>=0) { // 9 - 0 
    flag = ws.write(i--+'');
  }
}
ws.on('drain',()=>{ // drain只有嘴塞满了吃完了才会触发，不是消耗完就触发
  console.log('干了');
  write();
})
write();