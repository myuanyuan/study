onmessage = function (e) {
  let sum = 0;
  for(var i = 0;i<e.data;i++){
    sum += i;
  }
  this.postMessage(sum)
}
// 这里不能操作dom


