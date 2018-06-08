console.log(1);

setTimeout(()=>{
  console.log(2);
},1000);
while (true){}
setTimeout(()=>{
  console.log(3);
},500)

// 调用时不会立马放去，当成功时才会放到队列中
// 栈中的代码执行完毕后 会调用队列中的代码,不停的循环
// 当时间到达时 要看栈中是否已经执行完了，如果没执行完，就不会调用队列中的内容